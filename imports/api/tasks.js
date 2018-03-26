import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    Meteor.publish('tasks', function () {
        return Tasks.find({
            $or: [
                { private: { $ne: true} },
                { owner: this.userId }
            ]
        });
    });
}

Meteor.methods({
    'tasks.insert'(text){
        check(text, String);

        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        })
    },

    'tasks.remove'(taskId){
        check(taskId, String);

        const task = Tasks.findOne(taskId);

        if (task.private && Meteor.userId() !== task.owner) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },

    'tasks.setChecked'(taskId, info){
        check(taskId, String);
        check(info, Boolean);

        const task = Tasks.findOne(taskId);

        if (Meteor.userId() !== task.owner) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { checked: info } });
    },

    'tasks.setPrivate'(taskId, info){
        check(taskId, String);
        check(info, Boolean);

        const task = Tasks.findOne(taskId);

        if (Meteor.userId() !== task.owner) {
            throw new Meteor.Error('not-authorized');    
        }

        Tasks.update(taskId, { $set: { private: info } });
    },
});


import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './task.html';

Template.task.helpers({
    isOwner() {
        return Meteor.userId() === this.owner        
    }

})

Template.task.events({
    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
    'click .toggle-checked'() {
        Meteor.call('tasks.setChecked', this._id, !this.checked);
    },
    'click .toggle-private'() {
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    }

})

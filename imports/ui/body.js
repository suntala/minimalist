import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './body.html';
import './task.js';


Template.body.onCreated(function () {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();

        if (instance.state.get('hideCompleted')) {
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 }});
        }
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
})

Template.body.events({
    // 'submit .new-task'(event) {
    'submit form'(event) {
        event.preventDefault();

        // const target = event.target;
        // const task = target.task.value;

        let name = $('[name="taskName"]').val();

        Meteor.call('tasks.insert', name);

        // target.task.value = '';
        // $('input').val('');
        $('[name="taskName"]').val('');
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
})


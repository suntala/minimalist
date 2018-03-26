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
        const confirm = window.confirm("Delete this task?");
        if (confirm) {
            Meteor.call('tasks.remove', this._id);
        }
    },
    'click .toggle-checked'() {
        Meteor.call('tasks.setChecked', this._id, !this.checked);
    },
    'click .toggle-private'() {
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    },
    'keyup [name=taskContent]'(event) {
        if(event.which == 13 || event.which ==27) {
            $(event.target).blur();
        }
        else {
            const editedTask = $(event.target).val();
            Meteor.call('tasks.edit', this._id, editedTask)
        }



        // const eventish = $(event.target).val();
        // const thisish = $(this._id)
        // alert('e: ' + eventish + 'this: ' + Object.keys(this))
        // const editedTask = $(event.target).val();
        // Meteor.call('tasks.edit', this._id, editedTask)
        // alert('e: ' + eventish + 'this: ' + this.taskName)
            //$(event.target).val() gives the name with changes, this.taskName gives old name

    }

})

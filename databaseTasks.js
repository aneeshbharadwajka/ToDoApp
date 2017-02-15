let operation = {
  write: function (sequelize, response, contentToWrite) {
    sequelize.query(`INSERT INTO tasks (description, status) VALUES ('${contentToWrite}',false) returning id`)
    .then(function (task) {
      const id = task[0].id
      response.status(200).send((id).toString())
    })
    .catch(function (err) {
      console.log('Error in Inserting', err)
      response.send('Error in Inserting', err)
    })
  },
  readItems: function (sequelize, response) {
    sequelize.query('SELECT id,description,status FROM tasks order by id',
    { type: sequelize.QueryTypes.SELECT })
    .then(function (tasks) {
      response.json(tasks)
    })
    .catch(function () {
      console.log('Error in reading todo list')
      response.send('Error in reading todo list')
    })
  },
  update: function (sequelize, response, description, status, id) {
    let query = `UPDATE tasks SET description = :description_, status = :status_ where id = :id_;`
    if (description === '') {
      query = `UPDATE tasks SET status = :status_ where id = :id_;`
      if (status === '') {
        response.send('No content to update')
      }
    } else if (status === '') {
      query = `UPDATE tasks SET description = :description_ where id = :id_;`
    }
    sequelize.query(query,
      {
        replacements: { description_: description, status_: status, id_: id }
      })
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('The task has been updated')
        response.send(`The task with id=${id} has been updated`)
      } else {
        console.log('The task doesnt exist to update')
        response.send(`The task with id=${id} doesnt exist to update`)
      }
    })
    .catch(function () {
      console.log('Error in Updating')
      response.send('Error in Updating')
    })
  },
  deleteFromDB: function (sequelize, response, id) {
    sequelize.query(`DELETE FROM tasks WHERE id = ${id} ;`)
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('The task is deleted')
        response.send(`The task has been deleted`)
      } else {
        console.log('The task doesnt exist to delete')
        response.send(`The task with id =${id} doesnt exist to delete`)
      }
    })
    .catch(function () {
      console.log('Error in deleting')
      response.send('Error in deleting')
    })
  },
  selectAll: function (sequelize, response, checkAll) {
    const query = `UPDATE tasks SET status = :status_;`
    sequelize.query(query,
      {
        replacements: {status_: checkAll}
      })
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('All tasks are updates')
        response.send(`All task are updated`)
      } else {
        console.log('NO task is updates')
        response.send(`NO task is updates`)
      }
    })
    .catch(function (error) {
      console.log('Error in Updating', error)
      response.send('Error in Updating')
    })
  },
  deleteCompleted: function (sequelize, response, status) {
    const query = `DELETE FROM tasks WHERE status = :status_;`
    sequelize.query(query,
      {
        replacements: {status_: status}
      })
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('The completed task(s) is/are deleted')
        response.send(`The completed task(s) is/are deleted`)
      } else {
        console.log('No task to delete')
        response.send(`No task to delete`)
      }
    })
    .catch(function () {
      console.log('Error in deleting')
      response.send('Error in delteing')
    })
  }

}

module.exports = operation

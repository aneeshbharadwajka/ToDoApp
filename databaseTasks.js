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
    let query = `UPDATE tasks SET description = :description, status = :status where id = :id;`
    let replacements
    if (description === '') {
      query = `UPDATE tasks SET status = :status where id = :id;`
      replacements = { status, id }
      if (status === '') {
        response.send('No content to update')
        replacements = { description, id }
      }
    } else if (status === '') {
      query = `UPDATE tasks SET description = :description  where id = :id;`
    }
    sequelize.query(query,
      {
        replacements
      })
      .then(function (task) {
        if (task[1].rowCount) {
          response.send(`The task with id=${id} has been updated`)
        } else {
          response.send(`The task with id=${id} doesnt exist to update`)
        }
      })
      .catch(function () {
        response.send('Error in Updating')
      })
  },
  deleteFromDB: function (sequelize, response, id) {
    sequelize.query(`DELETE FROM tasks WHERE id = ${id} ;`)
      .then(function (task) {
        if (task[1].rowCount) {
          response.send(`The task has been deleted`)
        } else {
          response.send(`The task with id =${id} doesnt exist to delete`)
        }
      })
      .catch(function () {
        response.send('Error in deleting')
      })
  },
  selectAll: function (sequelize, response, checkAll) {
    const query = `UPDATE tasks SET status = :status_;`
    sequelize.query(query,
      {
        replacements: { status_: checkAll }
      })
      .then(function (task) {
        if (task[1].rowCount) {
          response.send(`All task are updated`)
        } else {
          response.send(`No task is updated`)
        }
      })
      .catch(function (error) {
        response.send('Error in Updating')
      })
  },
  deleteCompleted: function (sequelize, response, status) {
    const query = `DELETE FROM tasks WHERE status = :status_;`
    sequelize.query(query,
      {
        replacements: { status_: status }
      })
      .then(function (task) {
        if (task[1].rowCount) {
          response.send(`The completed task(s) is/are deleted`)
        } else {
          response.send(`No task to delete`)
        }
      })
      .catch(function () {
        response.send('Error in delteing')
      })
  }

}

module.exports = operation

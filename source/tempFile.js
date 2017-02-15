var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}
const escapeHtml = string => String(string).replace(/[&<>"'`=/]/g, s => entityMap[s])
let listOfId = {}

function checkall (checkStatus, testcallback) {
  $.ajax({
    url: `/update/`,
    type: 'PUT',
    data: `checkAll=${checkStatus}`,
    success: (result, status, xhr) => {
      for (let key in listOfId) {
        listOfId[key].status = checkStatus
      }
      render()
      testcallback(xhr)
    },
    error: function (textStatus, errorThrown) {
      render()
      console.log(textStatus, errorThrown)
      testcallback(textStatus, errorThrown)
    }
  })
}

function deleteCompleted (testcallback) {
  $.ajax({
    url: `/delete/`,
    type: 'DELETE',
    data: `status=true`,
    success: (result, status, xhr) => {
      for (let key in listOfId) {
        if (listOfId[key].status === true) {
          delete listOfId[key]
        }
      }
      render()
      testcallback(xhr)
    },
    error: function (textStatus, errorThrown) {
      render()
      console.log(textStatus, errorThrown)
      testcallback(textStatus, errorThrown)
    }
  })
}

function updateStatus (id, status, testcallback) {
  const ItemStatus = status
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=&status=${ItemStatus}`,
    success: (result, status, xhr) => {
      if (xhr.responseText === `The task with id=${id} doesnt exist to update`);
      else {
        listOfId[id].status = ItemStatus
      }
      render()
      testcallback(xhr)
    },
    error: function (textStatus, errorThrown) {
      render()
      console.log(textStatus, errorThrown)
      testcallback(textStatus, errorThrown)
    }
  })
}

function updateDescription (id, updateDescription, testcallback) {
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=${escapeHtml(updateDescription)}&status=`,
    success: (result, status, xhr) => {
      if (xhr.responseText === `The task with id=${id} doesnt exist to update`);
      else {
        listOfId[id].description = updateDescription
      }
      render()
      testcallback(xhr)
    },
    error: function (textStatus, errorThrown) {
      render()
      console.log(textStatus, errorThrown)
      testcallback(textStatus, errorThrown)
    }
  })
}

function deleteItem (id, testcallback) {
  $.ajax({
    url: `/delete/${id}`,
    type: 'DELETE',
    success: (result, status, xhr) => {
      delete listOfId[id]
      render()
      testcallback(xhr)
    },
    error: function (textStatus, errorThrown) {
      render()
      console.log(textStatus, errorThrown)
      testcallback(textStatus, errorThrown)
    }
  })
}

function filterTodo (status) {
  if (status === true || status === false) {
    let filteredList = {}
    for (let key in listOfId) {
      if (listOfId[key].status === status) {
        filteredList[key] = listOfId[key]
      }
    }
    return filteredList
  } else {
    return 'Invalid Status'
  }
}

function getDomList () {
  let domList = '<ul class="todo-list">'
  let checked
  for (let key in listOfId) {
    let description = escapeHtml(listOfId[key].description)
    checked = (listOfId[key].status === true) ? 'checked' : ''
    domList += createLi(key, description, checked)
    if (listOfId[key].status === false) {
      $('.toggle-all').prop('checked', false)
    }
  }
  domList += '</ul>'
  return domList
}

function addItem (content) {
  $.post(`/write/${escapeHtml(content)}`, function (data) {
    listOfId[data] = { 'description': escapeHtml(content), 'status': false }
    $('.new-todo').val('')
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow')
    render()
  })
}

function createLi (id, description, checked = '') {
  const className = (checked === '') ? 'active' : 'completed'
  return `<li id="${id}" class ="${className}">
      <div class="view">
      <input class ="toggle" type="checkbox" id="todo-checkbox-${id}" ${checked}>
      <label id="todo-label-${id}">${description}</label>
      <input id="todo-edit-textbox-${id}" class="edit" type="text" name="editableText">
      <button id="todo-button-${id}" class="destroy"></button>
      </div>
      
      </li>`
}

function itemFunctionality () {
  // console.log('itemFunctionality')
  $('.destroy').click(function () {
    deleteItem($(this).closest('li').attr('id'), testcallback)
  })

  $('.toggle').change(function () {
    const id = $(this).closest('li').attr('id');
    (this.checked) ? updateStatus(id, true, testcallback) : updateStatus(id, false, testcallback)
  })

  $('li').dblclick(function () {
    const value = $(this).find('label').hide().text()
    $(this).find('.destroy').hide()
    $(this).find('.edit').show().focus().val(value)
  })

  $('.edit').focusout(function () {
    const changedContent = $(this).hide().val()
    if (changedContent === '') {
      deleteItem($(this).closest('li').attr('id'), testcallback)
    } else {
      const originalContent = $(this).prev().text()
      if (changedContent !== originalContent) {
        updateDescription($(this).closest('li').attr('id'), changedContent, testcallback)
      } else {
        $(this).prev().show()
      }
    }
  })

  $('.edit').keyup(function (event) {
    if (event.which === 13) {
      $(this).focusout()
    } else if (event.which === 27) {
      // console.log('esc')
      $(this).off('focusout').hide()
      $(this).prev().show()
    }
  })
}

function listFunctionality () {
  // console.log('listFunctionality')
  $('.header .new-todo').keyup(function (event) {
    const content = $('.new-todo').val()
    if (event.keyCode === 13 && content !== '') {
      addItem(content)
    } else {
      $('html, body').animate({ scrollTop: 0 }, 50)
    }
  })

  $('.toggle-all').change(function () {
    const status = this.checked
    const toggle = (status) ? 'check' : 'uncheck'
    const r = confirm(`Are you u want to ${toggle} all items?`)
    if (r === true) {
      $('.toggle').prop('checked', status)
      checkall(status, testcallback)
    } else {
      $('.toggle-all').prop('checked', !this.checked)
    }
  })

  $('.clear-completed').click(() => deleteCompleted(testcallback))

  $(window).on('hashchange', () => filterList())

  $('#scrollUp').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800)
    return false
  })
}

function showActiveCount () {
  // console.log('showActiveCount')
  const activeList = filterTodo(false)
  const activeListCount = Object.keys(activeList).length
  const itemString = (activeListCount === 1) ? 'item' : 'items'
  $('.todo-count').text(`${activeListCount} ${itemString} left`);
  (activeListCount === 0) ? $('.toggle-all').prop('checked', true) : $('.toggle-all').prop('checked', false)
}

function showClearComplete () {
  // console.log('showClearComplete')
  const completedList = filterTodo(true);
  (Object.keys(completedList).length === 0) ? $('.clear-completed').hide() : $('.clear-completed').show()
}

function hideWhenNoList () {
  // console.log('hideWhenNoList')
  if (Object.keys(listOfId).length === 0) {
    $('.footer').hide()
    $('.toggle-all').hide()
  } else {
    $('.footer').show()
    $('.toggle-all').show()
  }
}

function filterList () {
  // console.log('filterList')
  const url = location.hash
  $('.filters a').prop('class', '')
  switch (url) {
    case '#/': $('a[href$="#/"').attr('class', 'selected')
      $('.todo-list li').show()
      break
    case '#/active': $('a[href$="#/active"]').attr('class', 'selected')
      $('.todo-list .active').show()
      $('.todo-list .completed').hide()
      break
    case '#/completed': $('a[href$="#/completed" ]').attr('class', 'selected')
      $('.todo-list .active').hide()
      $('.todo-list .completed').show()
      break
    default: $('a[href$="#/"').attr('class', 'selected')
      $('.todo-list li').show()
  }
}

function render () {
  // console.log(todos)
  // console.log('render')
  const domList = getDomList()
  $('.main').html(domList)
  $('.editTextbox').hide()
  showActiveCount()
  showClearComplete()
  hideWhenNoList()
  filterList()
  itemFunctionality()
}

function read () {
  // console.log('read')
  $.get('/read', (data) => {
    data.forEach(function (item) {
      listOfId[item.id] = item
    })
    render()
    listFunctionality()
  })
}

function testcallback () {
  // just to use for testcase
}

$(document).ready(function () {
  read()
})

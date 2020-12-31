module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <p><a href="/author">author</a></p>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: (topics) => {
    var list = '<ul>';
    var i = 0;
    while (i < topics.length) {
      list =
        list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  },
  authorSelect: (authors, author_id) => {
    let tag = '';

    for (author of authors) {
      let selected = '';
      if (author.id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${author.id}"${selected}>${author.name}</option> `;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `;
  },
  authorTable: (authors) => {
    let table = `<table> 
    <thead>
        <tr>
            <th>Name</th>
            <th>Profile</th>
            <th>Update</th>
            <th>Delete</th>
        </tr>
    </thead>
    <tbody>`;

    for (author of authors) {
      table += `<tr>
                <td>${author.name}</td>
                <td>${author.profile}</td>
                <td><a href="/update_author?id=${author.id}">update</a></td>
                <td>
                  <form action="delete_author_process" method="POST">
                    <input type="hidden" name="id" value="${author.id}">
                    <input type="submit" value="delete">
                  </form>
                </td>
                </tr>`;
    }
    table += `</tbody></table>`;
    return table;
  },
};

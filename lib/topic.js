let db = require('./db');
let template = require('./template');
var qs = require('querystring');
var url = require('url');

exports.main = (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    let title = 'Welcome';
    let description = 'Hello, Node.js';
    let list = template.list(topics);
    let html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = (request, response) => {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) {
      throw error;
    }
    db.query(
      `SELECT topic.id, title, description, created, author_id, name, profile FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [queryData.id],
      (error2, topic) => {
        if (error2) {
          throw error2;
        }
        console.log(queryData.id, topic);
        let list = template.list(topics);
        let html = template.HTML(
          topic[0].title,
          list,
          `<h2>${topic[0].title}</h2>
          ${topic[0].description}
          <p>by ${topic[0].name}</p>`,
          ` <a href="/create">create</a>
              <a href="/update?id=${topic[0].id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <input type="submit" value="delete">
              </form>`
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    db.query(`SELECT * FROM author`, (error2, authors) => {
      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(
        title,
        list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `,
        ''
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = (request, response) => {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.query(
      `INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      (err, result) => {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) {
      throw error;
    }
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [queryData.id],
      (error2, topic) => {
        db.query(`SELECT * FROM author`, (error3, authors) => {
          var html = template.HTML(
            topic[0].title,
            template.list(topics),
            `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${
                    topic[0].title
                  }"></p>
                  <p>
                    <textarea name="description" placeholder="description">${
                      topic[0].description
                    }</textarea>
                  </p>
                  <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

exports.update_process = (request, response) => {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title, post.description, post.author, post.id],
      (err, result) => {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      }
    );
  });
};

exports.delete_process = (request, response) => {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err, result) => {
      if (err) {
        throw err;
      }
      response.writeHead(302, { Location: `/` });
      response.end();
    });
  });
};

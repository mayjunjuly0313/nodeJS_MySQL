let db = require('./db');
let template = require('./template');
var qs = require('querystring');
var url = require('url');
const { request } = require('http');

exports.main = (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) {
      throw error;
    }
    db.query(`SELECT * FROM author`, (error2, authors) => {
      let title = 'Author List';
      let list = template.list(topics);
      let authorTable = template.authorTable(authors);
      let html = template.HTML(
        title,
        list,
        `
        <form action="/create_author" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
        </form>
      `,
        authorTable
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = (request, response) => {
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    let post = qs.parse(body);
    console.log(post);
    db.query(
      `INSERT INTO author (name, profile) VALUES (?, ?)`,
      [post.title, post.description],
      (err) => {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: `/author` });
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
    db.query(`SELECT * FROM author`, (error2, authors) => {
      db.query(
        `SELECT * FROM author WHERE id=?`,
        [queryData.id],
        (error3, author) => {
          let title = 'Author List';
          let list = template.list(topics);
          let authorTable = template.authorTable(authors);
          let html = template.HTML(
            title,
            list,
            `
          <form action="/update_author_process" method="POST">
          <input type="hidden" name="id" value="${author[0].id}">
            <p><input type="text" name="title" value="${author[0].name}" placeholder="title"></p>
            <p>
              <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
            </p>
            <p>
              <input type="submit" value="update">
            </p>
          </form>
        `,
            authorTable
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
  });
};

exports.update_process = (request, response) => {
  let body = ``;
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    let post = qs.parse(body);
    db.query(
      `UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.title, post.profile, post.id],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.delete_process = (request, response) => {
  let body = ``;
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    let post = qs.parse(body);
    db.query(`DELETE FROM author WHERE id=?`, [post.id], (error, result) => {
      if (error) {
        throw error;
      }
      response.writeHead(302, { Location: `/author` });
      response.end();
    });
  });
};

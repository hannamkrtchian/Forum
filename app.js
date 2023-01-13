var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var showPostRouter = require('./routes/posts/showPost');
var editPostRouter = require('./routes/posts/editPost');
var deletePostRouter = require('./routes/posts/deletePost');
var updatePostRouter = require('./routes/posts/updatePost');
var createPostRouter = require('./routes/posts/createPost');
var createPostFormRouter = require('./routes/posts/createPostForm');
var updateCommentRouter = require('./routes/comments/updateComment');
var createCommentRouter = require('./routes/comments/createComment');
var deleteCommentRouter = require('./routes/comments/deleteComment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/posts/show', showPostRouter);
app.use('/posts/edit', editPostRouter);
app.use('/posts/delete', deletePostRouter);
app.use('/posts/update', updatePostRouter);
app.use('/posts/create', createPostRouter);
app.use('/posts/createpage', createPostFormRouter);
app.use('/comments/update', updateCommentRouter);
app.use('/comments/create', createCommentRouter);
app.use('/comments/delete', deleteCommentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

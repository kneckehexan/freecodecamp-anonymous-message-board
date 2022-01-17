const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

const createThread = async (req, res) => {
  req.body.board = req.params.board;
  //console.log(req.params);
  //console.log(req.body.board);
  const newThread = await Thread.create(req.body)
  if (!newThread) {
    return res.json({error: 'Coudln\'t create new thread'});
  }
  return res.send(req.body);
}

/**
 * Get the 10 latest threads with at least 3 replies each.
 */
const getThreads = async (req, res) => {
  const board = req.params.board;
  const threads = await Thread.find({board: board})

  // Get the thread id's
  const threadIds = threads.map(t => t._id);

  // Find the replies that match the thread id's
  const replyObj = await Reply.find({'threadid': {$in: threadIds}});

  // Merge the data from the two calls to the DB into one 'rep'-ly/response
  var rep = threads.map(t => {
    return ({_id: t._doc._id,
      text: t._doc.text,
      created_on: t._doc.createdAt,
      replies: replyObj
        .filter(o => {
          return o.thread_id.toString() === t._doc._id.toString();
        })
        .map(o => {
          return {_id: o._id, text: o.text, created_on: o.createdAt}
        }),
      replycount: replyObj
        .filter(o => {
          return o.thread_id.toString() === t._doc._id.toString();
        }).length
    });
  });
  return res.send(rep);
}

const deleteThread = async (req, res) => {
 return res.json({thread: 'delete'});
}

const reportThread = async (req, res) => {
 return res.json({thread: 'reported'});
}

module.exports = {
  createThread,
  getThreads,
  deleteThread,
  reportThread
}
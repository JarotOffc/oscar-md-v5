let handler = m => m

handler.before = function (m) {
  let user = global.db.data.users[m.sender]
       let rank
if ((user.owner === false) && (user.premium === false) && (user.helper === false) && (user.police === false) ) rank =  'User Gratisan'
else if ((user.owner === false) && (user.premium === true) ) rank =  'User Premium'
else if ((user.police === true) && (user.owner === false)) rank =  'Police Bot'
else if ((user.police === true) && (user.premium === true)) rank =  'Police Bot & User Premium'
else if ((user.helper === true) && (user.premium === true)) rank =  'Helper Premium'
else if ((user.helper === true) && (user.owner === true)) rank = 'Helper Berbau Owner'
else if ((user.helper === true) && (user.premium === false) && (user.owner === false)) rank = 'Helper Gratisan'
else if ((user.owner === true) && (user.premium === true)) rank = 'Owner Bot & User Premium'
else if ((user.owner === true) && (user.premium === false)) rank = 'Owner Bot'
  user.rank = rank
  return true
}

module.exports = handler
const express = require('express');
const nunjucks = require('nunjucks');

const common = require('./common/common')

const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

var env = new nunjucks.Environment();
env.addFilter('nl2br', function(str) {
    return str.replace(/\n/g, '<br>');
});


// 정적파일 처리
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// 세션사용을 위한 세팅
const session = require('express-session');
//const sessionFile = require('session-file-store')(session);

const sessionDB = require('express-mysql-session')(session);
const db = require('./common/db')

// 세션 세팅
app.use(session({
    secret: "kiwu",
    resave: true,
    saveUninitialized: false,

    // 세션 정보를 파일로 저장
    //store: new sessionFile({logFn: function(){}})

    //세션 정보를 database에 저장
    store: new sessionDB(db.db)
}));

// post 값 받기
app.use(express.urlencoded({
    extended: true
}));


// view 단에서 common 함수 사용할때
app.locals.common = common;


indexRouter = require('./router/home');
boardRouter = require('./router/board');
memberRouter = require('./router/member');

app.use('/', indexRouter);
app.use('/board', boardRouter);
app.use('/member', memberRouter);


//nunjucks
/*    
app.get('/', (req, res) => {
    console.log('첫페이지 접속됨');

    let fruits = ['apple', 'banana', 'orange']
    const sendData = {
        name: "jio",
        fruits
    }
    res.render('index', sendData);
}); 
*/


/*
// get,post,put,delete
app.get('/', (req, res) => {
    console.log('첫페이지 접속됨');
    res.send('<h1>안녕</h1> 김지오의 홈페이지')
});  

app.get('/member', (req, res) => {
    console.log('회원페이지 접속됨');
    res.send('<h1>안녕</h1> 회원페이지')
});  

app.get('/board', (req, res) => {
    console.log('게시판페이지 접속됨');
    res.send('<h1>안녕</h1> 게시판페이지')
});
*/

// 404 not found
app.use((req,res) => {
    console.log('여기');
    res.status(404).send('404 not found');
});


app.listen(80, () => {
    console.log('80포트에서 express 서버 대기 중...');
});


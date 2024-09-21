const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

// 정적파일 처리
app.use('/assets', express.static(__dirname + '/assets'));

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


if(process.env.NODE_ENV==='production'){
    module.exports ={
        mongoURI: 'mongodb+srv://simpledev:simpledev@vidjot-prod.0ovdy.mongodb.net/vidjot-dev?retryWrites=true&w=majority'
    };
}else{
    module.exports = {
        mongoURI:'mongodb://localhost/vidjot-dev'
    };
}
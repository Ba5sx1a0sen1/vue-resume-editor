/**
 * Created by bassxiaosen1 on 2018/6/23.
 */
let app = new Vue({
    el:'#app',
    data:{
        currentUser:{
            objectId:undefined,
            email:'',
        },
        editingName:false,
        loginVisible:false,
        registerVisible:false,
        shareVisible:false,
        resume:{
            name:'姓名',
            gender:'女',
            birthday:'19901111',
            jobTitle:'前端工程师',
            phone:'138123123123',
            email:'example@example.com',
            skills:[
                {name:'请填写技能名称',description:'请填写技能描述'},
                {name:'请填写技能名称',description:'请填写技能描述'},
                {name:'请填写技能名称',description:'请填写技能描述'},
                {name:'请填写技能名称',description:'请填写技能描述'},
            ],
            projects:[
                {name:'请填写项目名称',keywords:'请填写关键词',link:'请填写项目链接',description:'请填写项目描述'},
                {name:'请填写项目名称',keywords:'请填写关键词',link:'请填写项目链接',description:'请填写项目描述'},
            ]
        },
        register:{
            email:'',
            password:'',
        },
        login:{
            email:'',
            password:'',
        },
        shareLink:'不知道',
    },
    methods:{
        onEdit(key,value){
            let regex = /\[(\d+)\]/g
            key=key.replace(regex,(match,number)=>`.${number}`)
            keys = key.split('.')
            let result = this.resume
            for(let i=0;i<keys.length;i++){
                if(i===keys.length-1){
                    result[keys[i]] = value
                }else{
                    result = result[keys[i]]
                }
                //result = this.resume
                //keys  = ['skills','0','name']
                //i=0 result === result['skills'] === this.resume.skills
                //i=1 result === result['0'] === this.resume.skills.0
                //i=2 result === result['name'] = this.resume.skills.0.name
                //result === this.resume['skills']['0']['name']
            }
            //this.resume['skills']['0']['name']=value
        },
        onClickSave(){
            let currentUser = AV.User.current();//获取当前用户
            if(!currentUser){
                this.showLogin()
            }else{
                console.log(1111)
                this.saveResume()
            }
        },
        hasLogin(){
            return !!this.currentUser.objectId
        },
        onRegister(){
            let user = new AV.User();
            user.setUsername(this.register.email);
            user.setPassword(this.register.password);
            user.setEmail(this.register.email);
            user.signUp().then(function (loggedInUser) {
                console.log(loggedInUser);
                alert('success');
            }, function (error) {
                alert(error);
            });
        },
        onLogin(){
            AV.User.logIn(this.login.email, this.login.password).then((loggedInUser)=> {
                console.log(loggedInUser);
                loggedInUser = loggedInUser.toJSON()
                this.currentUser.objectId = loggedInUser.objectId
                this.currentUser.email = loggedInUser.email
                window.location.reload()
                console.log(1)
                this.loginVisible = false
            },  (error)=> {
                alert(error);
            });
        },
        onLogOut(){
            let currentUser = AV.User.current();
            if(currentUser===null){
                alert('当前未登录')
                return
            }
            AV.User.logOut();
            alert('注销成功')
            window.location.reload()
        },
        showLogin(){
            this.loginVisible = true
        },
        saveResume(){
            let {id} = AV.User.current()
            console.log(id);
            // 第一个参数是 className，第二个参数是 objectId
            let user = AV.Object.createWithoutData('User', id);
            // 修改属性
            user.set('resume', this.resume);
            // 保存到云端
            user.save().then(()=>{
                alert('保存成功')
            },()=>{
                alert('保存失败')
            });
        },
        getResume(){
            var query = new AV.Query('User');
            query.get(this.currentUser.objectId).then( (user) =>{
                let resume = user.toJSON().resume
                Object.assign(this.resume,resume)//稳
            },  (error) =>{
                // 异常处理
            });
        },
        addSkill(){
            this.resume.skills.push({name:'请填写技能名称',description:'请填写技能描述'})
        },
        addProject(){
            this.resume.projects.push({name:'请填写项目名称',keywords:'请填写关键词',link:'请填写项目链接',description:'请填写项目描述'})
        },
        removeSkill(index){
            this.resume.skills.splice(index,1)
        },
        removeProject(index){
            this.resume.projects.splice(index,1)
        }
    }
})

let currentUser = AV.User.current()
if(currentUser){
    app.currentUser = currentUser.toJSON()
    app.getResume()
    app.shareLink = location.origin + location.pathname + '?user_id=' + app.currentUser.objectId
}

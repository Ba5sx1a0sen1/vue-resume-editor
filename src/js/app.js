/**
 * Created by bassxiaosen1 on 2018/6/23.
 */
var  app = new Vue({
    el:'#app',
    data:{
        editingName:false,
        resume:{
            name:'姓名',
            gender:'女',
            birthday:'19901111',
            jobTitle:'前端工程师',
            phone:'138123123123',
            email:'example@example.com'
        },
    },
    methods:{
        onEdit(key,value){
            this.resume[key] = value
        }
    }
})
//Data Module
var budgetController=(function(){
    var Income=function (id,description,value){
        this.id=id;
        this.description=description;
        this.value=value
    } 
    var Expense=function (id,description,value){
        this.id=id;
        this.description=description;
        this.value=value
        this.percentage=-1     
    }
    Expense.prototype.cPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100)
        }else{
            this.percentage=-1
        }
    }
    Expense.prototype.gPercentage=function(){
        return this.percentage
    }
    var data={
        allItem:{
            inc:[],//[{id:0,description:'salary',value:4567},{id:1,description:'tip',value:345}]
            exp:[]
        },
        total:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage:-1
    }
    function calculateTotal(type){
        var sum=0;
        data.allItem[type].forEach(function(current){
            sum = sum + current.value;
        })
        //console.log(sum)
        data.total[type]=sum;
    }
    return {
        addItem:function(type,description,value){
            var newItem;
            if(data.allItem[type].length===0){
                var ID=0;
            }else{
                var ID=data.allItem[type][data.allItem[type].length-1].id+1;
            }
            if(type==='inc'){
                newItem=new Income(ID,description,value)
            }else if(type==='exp'){
                newItem=new Expense(ID,description,value)
            }
            // data.allItem.inc.push()
            // data.allItem.exp.push()
            // data.allItem['inc'].push()
            // data.allItem['exp'].push()
            data.allItem[type].push(newItem)
            return newItem;
        },
        test:function(){
            console.log(data)
        },
        calculateBudget:function(){
            //1 income total, expense total
            calculateTotal('inc')
            calculateTotal('exp')
            //2 income total - expense total
            data.budget=data.total.inc - data.total.exp
            //3 percentage
            if(data.total.inc >0){
                data.percentage=Math.round((data.total.exp/data.total.inc)*100)
            }else{
                data.percentage=-1;
            }
            // totalincome151000    100%
            // totalexpense11000    ?
            //                     (totalexpense/totalincome) * 100%
        },
        getBudget:function(){
            return {
                budget: data.budget,
                totalIncome: data.total.inc,
                totalExpense: data.total.exp,
                percentage: data.percentage
            }
        },
        deleteItem:function(type,id){
            //type='inc'
            //id=2//5
            //data.allItem['inc']=[{id:1,des:'hjk',value:100},{id:2,des:'hjk',value:100},{id:3,des:'hjk',value:100}]
            var idArray=data.allItem[type].map(function(cur){
                return cur.id
            })
            //idArray=[1,2,3]
            var index=idArray.indexOf(id)//2//5 => -1
            //index=1
            if(index !== -1){
                data.allItem[type].splice(index,1)
            }
            // idArray=['mgmg','agag']
            // idArray[0] => 'mgmg'
            // idArray[1] => 'agag'
            //         0   <= idArray.indexOf('mgmg')
            //         1   <= idArray.indexOf('agag')
        },
        calculatePercentage:function(){
            data.allItem.exp.forEach(function(cur){
                cur.cPercentage(data.total.inc)
            })
        },
        getPercentage:function(){
            var allPercentage=data.allItem.exp.map(function(cur){
                return cur.gPercentage()
            })
            return allPercentage
        }
    }
})();

//UI Module
var UIController=(function(){
    var DOMString={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeElement:'.income__list',
        expenseElement:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensePercentageLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    }
    function formatNumber(num,type){
        num=Math.abs(num)//45656
        num=num.toFixed(2)//45656.00
        var numSplit,int,dex
        numSplit=num.split('.')//['45656','00']
        int=numSplit[0]//'45656'
        dec=numSplit[1]//'00'
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length)
        }//45,656
        type==='inc'? type='+' : type='-'
        return type+int+'.'+dec//+45,656.00
    }
    return {
        getInput:function(){
            return {
                type:document.querySelector(DOMString.inputType).value,
                description:document.querySelector(DOMString.inputDescription).value,
                value:parseFloat(document.querySelector(DOMString.inputValue).value)
            }
        },
        getDOMString:function(){
            return DOMString
        },
        addListItem:function(obj,type){
            //console.log(obj,type);
            var html,newHtml,element;
            if(type==='inc'){
                element=DOMString.incomeElement;
                html=' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> '
            }else if(type==='exp'){
                element=DOMString.expenseElement;
                html=' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';
            }
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value)
            // if(type === 'inc'){
            //     document.querySelector('.income__list').insertAdjacentHTML('beforeend',newHtml)
            // }else if(type==='exp'){
            //     document.querySelector('.expenses__list').insertAdjacentHTML('beforeend',newHtml)
            // } 
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);      
        },
        clearField:function(){
            var field=document.querySelectorAll(DOMString.inputDescription+','+DOMString.inputValue);
            //console.log(field);
            var fieldArr=Array.from(field);//Array.prototype.slice.call(field)
            //console.log(fieldArr);
            fieldArr.forEach(function(current){
                current.value='';
            }) 
            fieldArr[0].focus(); 
        },
        displayBudget:function(obj){
            var type;
            obj.budget>0 ? type='inc': type='exp'
            document.querySelector(DOMString.budgetLabel).textContent=formatNumber(obj.budget,type);//+56,678.00
            document.querySelector(DOMString.incomeLabel).textContent=formatNumber(obj.totalIncome,type);
            document.querySelector(DOMString.expenseLabel).textContent=formatNumber(obj.totalExpense,type) ;
            if(obj.totalIncome>0){
                document.querySelector(DOMString.percentageLabel).textContent=obj.percentage + ' %';
            }else{
                document.querySelector(DOMString.percentageLabel).textContent='---';
            }
        },
        deleteListItem:function(selectID){
            var el=document.getElementById(selectID)
            el.parentNode.removeChild(el)
        },
        displayPercentage:function(allPercentage){
            var field=document.querySelectorAll(DOMString.expensePercentageLabel)
            var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++){
                    callback(list[i],i)
                }
            }
            nodeListForEach(field,function(value,key){
                if(allPercentage[key]>0){
                    value.textContent=allPercentage[key] + ' %'
                }else{
                    value.textContent='---'
                }
                
            })
        },
        displayMonth:function(){
            var now=new Date()
            var year=now.getFullYear()//2020
            var month=now.getMonth()//9
            var months=['January','February','March','April','May','June','July','August','September','October','November','December']
            month=months[month]
            document.querySelector(DOMString.dateLabel).textContent=month +' '+ year;
        }
    }
})();

//Controller Module
var Controller=(function(budgetCtrl,UICtrl){
    function updateBuget(){
        // 4. Calculate the budget
        budgetCtrl.calculateBudget()
        var budget=budgetCtrl.getBudget()
        // 5. Display the budget On the UI
        UICtrl.displayBudget(budget)
    }
    function ctrlAddItem(){
        // 1. Get the file input data
        var input=UICtrl.getInput();
        if(input.description!=='' && input.value!=='' && !isNaN(input.value)){
            // 2. Add the item to the budget controller
            var newItem=budgetCtrl.addItem(input.type,input.description,input.value)
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type)
            UICtrl.clearField();
            updateBuget();
            updatePercentage()
        }
    }
    function ctrlDeleteItem(event){
        var itemID=event.target.parentNode.parentNode.parentNode.parentNode.id; // 'inc-0'
        var splitID=itemID.split('-'); // ['inc','0']
        var type=splitID[0]; // 'inc'
        var id=parseInt(splitID[1]); // 0
        // 1. delete the item from the datastructure
        budgetCtrl.deleteItem(type,id)
        // 2. delete the item from the UI
        UICtrl.deleteListItem(itemID)
        // 3. Update and Show the New Budget
        updateBuget()
        updatePercentage()
    }
    function updatePercentage(){
        //1. data module
        budgetCtrl.calculatePercentage()
        var allPercentage=budgetCtrl.getPercentage()
        //2. ui module
        UICtrl.displayPercentage(allPercentage)
    }
    function setupEventListener(){
        var DOM=UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem()
            }
        })
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
    }
    return {
        init:function(){
            console.log('Application Start');
            UICtrl.displayMonth()
            UICtrl.displayBudget({budget:0,totalIncome:0,totalExpense:0,percentage:-1})
            setupEventListener();
        }
    }
})(budgetController,UIController);
Controller.init()

// document.querySelector() => onlyone
// document.getElementById() => onlyone
// document.getElementsByClassName() => array
// document.getElementsByTagName() => array

// document.querySelectorAll('.add__desdcription,.add__value') => nodelist 
//                                              => array
//                                              => array.forEach((cur)=>{cur.value=''})

// budgetController=(function(){
//     publicMethod 2
//     publicMethod 4 (calculateBudget) 
//     //1 data.allItem.inc[+++]//data.allItem.exp[+++] -> UI.inputString to UI.parseFloat -> Controller.ifelse(des!=''&val!=''&!isNaN(val)){} //16.10.2020
//     //2 income-expense
//     //3 percentage
            
// })()

// UIController=(function(){
//     publicMethod 1
//     publicMethod 3
// })()

// Controller=(function(){
//     updateBudget{
//         //4 budget calculate
//         budgetController.publicMethod 4 
//         //5 ui
//     }
//     ctrlAddItem{
//         //1 get input
//         sth1=UIController.publicMethod 1
//         //2 calculate
//         sth2=budgetController.publicMethod 2 <- sth1
//         //3 ui 
//         sth3=UIController.publicMethod 3 <- sth2
//         clearfield{}
//         //4 //5 
//         updateBudget{}
//     }
//     buttonEvent{
//         ctrlAddItem{}
//     }
//     enterEvent{
//        ctrlAddItem{}
//     }
// })()

// int='3456 789'
// //'45678'.substr(index,number)
// if(int.length>3){
//     int//'3456789'
//     int.substr(0,int.length-3)//'3456'
//     int//'789'
//     int.substr(int.length-3,int.length)//'789'
//     int.substr(0,int.length-3) + ',' + int.substr(int.length-3,int.length)//'3456,789'
// }
// int='3,456,789'


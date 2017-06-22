var currentIndex = 1; //track id's as number of groups gets larger(need unique id's)
var nodes = new vis.DataSet(); //initialize empty sets to add too
var edges = new vis.DataSet();
var selected = { //object for tracking the currently selected node
    params: null,
    state:false,
    id:null,
    splitID:null
}
var groupTrack = 0;
class nodeControl{
    constructor(){ 
        this.green = 0;      
    }
    nextShade(){
        this.green = this.green + 48;
    }
    currentShade(id){        
        var split = id.split(' ');
        if(id===''){split='';}
        var factor = 48*(split.length);        
        if(factor>255){
            factor=255;            
        }
        this.green = 0 + 36*(split.length);
        return this.green;
    }
    currentValue(id){
        var split = id.split(' ');        
        var factor = 1*(split.length);
        if(factor>100){
            factor = 100;
        }
        return 100 - factor;
    }
} 
var nodeObject = new nodeControl(); //can be used to track nodeObject of one thread or just to provide functions to track green rgba number
var green = nodeObject.currentShade('').toString();
nodes.add({id:'0',value:100,title:"core",color:{background:'rgba(255,'+green+',0,1)',border:'rgba(255,'+green+',0,1)'},mass:4})
function addGroup(){
    if(nodes.getIds().length === 0){
        var green = nodeObject.currentShade('').toString();
        nodes.add({id:'0',value:100,title:"core",color:{background:'rgba(255,'+green+',0,1)',border:'rgba(255,'+green+',0,1)'},mass:4})
    }
    else if(selected.state){
        groupTrack++;
        nodeObject.nextColor;
        var amount = document.getElementById('nodeCount').value;
        for(var i = 0; i< amount;i++){
            var green = nodeObject.currentShade(selected.id).toString();
            nodes.add({
                id: selected.id + ' '+currentIndex.toString(),
                value: nodeObject.currentValue(selected.id),
                color: {background:'rgba(255,'+green+',0,1)',border:'rgba(255,'+green+',0,1)'},
                mass:1
            })
            edges.add({from:selected.id,to:selected.id+' '+currentIndex,length:160});
            currentIndex++;
        }
    }
    else{
        alert("Please select a node before expanding.");
    }
    
}
function deleteGroup(){    
    nodes.forEach(function(child){
        if(child.id.indexOf(selected.id) !== -1){
            nodes.remove(child.id);
        }
    });
    nodes.remove(selected.id);
}
function clearAll(){ //empty the network
    nodes.clear();
    edges.clear();
    network.setData(data);
}
infoStore = [];

//createGroup(); //change later so that this is called on interaction
var container = document.getElementById('mynetwork'); 
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    nodes: {
        shape: 'dot'
    }    
};
var network = new vis.Network(container, data, options);
network.on("click", function (params) {      
    if(typeof params.nodes[0] !=='undefined'){
        selected.params = params;
        selected.id = params.nodes[0].replace('"','');
        selected.splitID = params.nodes[0].replace('"','').split(' ');
        selected.state = true;
    }  
})
network.on("doubleClick",function(params){
    addGroup();
});
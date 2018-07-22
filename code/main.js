
    // Get a reference to the database service
    var database = firebase.database();
    var trains = database.ref("Trains");
    var trainObjectArray=[];
    var trainObject={
                        "Train Name":"",
                        "Train Destination":"",
                        "First Train Time":"",
                        "Frequency":""
                    };

    

    $("#nav").css({"padding-right":"10px",margin:"8px"});

    $("#div").css({width:"1200px"});
    
    $("#div").append($("<h4>",{text:"Train schedules as of now"}));

    $("#div").append($("<table>",{id:"trainTable"}));

        $("#trainTable").css({"border-style":"solid"});
                $("#trainTable").append($("<tr>",{id:"tableRow"}));

    drawTable(trainObjectArray);

  

            $("#nav").append($("<p>",{text:"Add a Train Name"}));        
            $("#nav").append($("<input>",{id:"tname",text:" "}));
            $("#nav").append($("<p>",{text:"  "}));
            $("#nav").append($("<p>",{text:"Add a Destination"}));
            $("#nav").append($("<input>",{id:"tdest",text:" "}));
            $("#nav").append($("<p>",{text:"  "}));
            $("#nav").append($("<p>",{text:"First Train Time"}));
            $("#nav").append($("<input>",{id:"tftt",text:" "}));
            $("#nav").append($("<p>",{text:"  "}));
            $("#nav").append($("<p>",{text:"Frequency"}));
            $("#nav").append($("<input>",{id:"tfreq",text:" "}));
            $("#nav").append($("<p>",{text:"  "}));
            $("#nav").append($("<p>",{text:"                "}));
            $("#nav").append($("<button>",{class:"btn-lg btn-primary",text:"Add a Train", id:"addTrain"}));

    $("#addTrain").on("click",function(){


            trainObject["Train Name"]=$("#tname").val();
            trainObject["Train Destination"]=$("#tdest").val();
            trainObject["First Train Time"]=moment($("#tftt").val(),'HH:mm')["_i"];
            trainObject["Frequency"]=$("#tfreq").val()*1;
            trainObjectArray.push(trainObject);
            trains.set(trainObjectArray);
            $("tname").empty();
            $("tdest").text="";
            $("tftt").text="";
            $("tfreq").text="";

        });

     

    trains.on("value", function(snapshot) {

        // Then we console.log the value of snapshot
        var abc=snapshot.val();

        trainObjectArray=[];
  
        for(var q=0; q < snapshot.val().length; q++){
           var tname = snapshot.val()[q]["Train Name"];
           var tdest = snapshot.val()[q]["Train Destination"];
           var tfreq = snapshot.val()[q]["Frequency"];
           var tftt = snapshot.val()[q]["First Train Time"];
            
           var temptrainObject={"Train Name":tname,"Train Destination":tdest,"Frequency":tfreq,"First Train Time":tftt};

           trainObjectArray.push(temptrainObject);
           var tob= getDiff(tfreq,tftt);
           temptrainObject["Next Arrival"]=moment(tob['Next Arrival']).format("HH:mm");
           temptrainObject["Next Train coming in "]=tob['Next Train coming in '];
          

           if(q === 0){
            drawTable(temptrainObject);
            };

           showValues(temptrainObject);


            
        };
      
                  
        // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
        // Again we could have named errorObject anything we wanted.
      }, function(errorObject) {
  
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
      });


    function getDiff(tfreq,tftt){
        
        timeRemaining=tfreq - (moment().diff(moment(tftt,'HH:mm'),'minutes') % tfreq);
        
        nextArrival=moment().add(moment.duration(timeRemaining, 'minutes'));
        
        nextArr=" "+nextArrival.format('HH:mm')+" ";
        
        return {"Next Arrival":nextArrival,"Next Train coming in ":timeRemaining};       
        //} while (inc < (1440/tfreq));

    };


    function drawTable(trainObjectArray){

        $("#tableRow").empty();

        for ([key, value] of Object.entries(trainObjectArray)) {
                $("#tableRow").append($("<th>",{text:key,id:"tableHeader"+key.replace(/ +/g,"")}));
                $("#tableHeader"+key.replace(/ +/g,"")).css({color:"white","background-color":"teal","border-style":"solid","padding":"4px"});
                
        } ;  

    };


    function showValues(objectt){                
            
            newr=objectt["Train Name"].replace(/ +/g,"");
            $("#tableRow"+newr).empty();
            $("#trainTable").append($("<tr>",{class:"trow", id:"tableRow"+newr}));
            for ([key, value] of Object.entries(objectt)) {
                
                newkey=key.replace(/ +/g,"");
                $("#tableRow"+newr).append($("<td>",{id:"tableBody"+newr+newkey}));
                        $("#tableBody"+newr+newkey).css({"border-style":"solid","padding":"4px"});
                        $("#tableBody"+newr+newkey).append(value);
                        
            };

    };



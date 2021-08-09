document.addEventListener("deviceready", onDeviceReady);

function onDeviceReady() {
   // //Batter
   // window.addEventListener("batterystatus", onBatteryStatus);
   // window.addEventListener("batterylow", onBatteryLow);
   // window.addEventListener("batterycritical", onBatteryCritical);
   // //Network
   // document.addEventListener("online", networkIsOnline);
   // document.addEventListener("offline", networkIsOffline);

   useFileSystem();
}

function onBatteryStatus(status) {
   var batteryStatusDiv = document.getElementById("battery-status");
   batteryStatusDiv.innerHTML = `Level: ${status.level} isPlugged: ${status.isPlugged}`;
}

function onBatteryLow(status) {
   alert(`Battery level low ${status.level}%`);
}

function onBatteryCritical(status) {
   alert(`Battery level Critical ${status.level}%\nRecharge Soon!`);
}

function networkIsOnline() {
   alert(`Network is online! \nConnection Type: ${navigator.connection.type}`);
}

function networkIsOffline() {
   alert(`Network is offline!`);
}

function useFileSystem() {
   var writeFileButton = document.getElementById("write-file-button");
   var readFileButton = document.getElementById("read-file-button");
   var clearFileButton = document.getElementById("clear-file-button");

   writeFileButton.addEventListener("click", showPrompt);
   readFileButton.addEventListener("click", readFile);
   clearFileButton.addEventListener("click", clearFile);

   var file = {};

   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile("newPersistentFile.txt", {create: true, exclusive: false}, function(fileEntry) {
         file = fileEntry;
         writeFile(fileEntry, null);   //clearing file after storing it in a variable
      }, 
      function (e) {
         console.log("Failed file write: " + e.toString());
      });
   });

   function showPrompt() {
      navigator.notification.prompt(
         'please enter your name',  //message
         writeFile,                 //Call back to invoke
         'Write a file!',           //title
         ['Ok'],                    //button Labels
         ''                         //default text
         );
   }

   function writeFile(results) {
      file.createWriter(function (fileWriter) {
          
         fileWriter.onwriteend = function() {
            console.log("Successful File write...");
         }

         fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString)
         }

         fileWriter.write(!!results.input1 ? results.input1: '');

      });
   }

   function readFile() {
      file.file(
         function(file) {
            var reader = new FileReader();

            reader.onloadend = function() {
               console.log("Successful file read: " + this.result);
               console.log(file.fullPath + ": " + this.result);

               if(this.result !== undefined) {
                  alert(this.result);
               }
            }
            reader.readAsText(file);
         },
         function(e) {
            cconsole.log(`Failed file read: ${e.toString()}`);
         }
      );
   }

   function clearFile(results) {
      function onSuccess(writer) {
         writer.truncate(0);
      }

      var onError = function(evt) {
         console.log(error.code);
      }
      
      file.createWriter(onSuccess, onError);
   }
}
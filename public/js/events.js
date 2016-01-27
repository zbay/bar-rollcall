 $("#localeSubmit").on("click", function(){
        var localeInput = $("#localeInput").val();
        if(localeInput.length){
            $("#searchResults").empty();
            $.ajax({url:"/search", method:"POST", data: {"localeInput": localeInput}, 
            success: function(data){
            var barBlurb = $("<div></div>").addClass("barBlurb").addClass("container");
            for(var i = 0; i < data.length; i++){
            var locID;
            if(data[i].state){
                locID = data[i].state;
            }
            else{
                locID = data[i].country;
            }
            var brTag = $("<br />");
            var blurbRow = $("<div></div>").addClass("row");
                var blurbAddressCol = $("<div></div>").addClass("col-xs-3").addClass("col-sm-3");
                    var blurbAddress = $("<div></div>").addClass("barAddress").text(data[i].address);
                    var blurbCity = $("<div></div>").text(data[i].city + ", " + locID);
                    var blurbPhone = $("<div></div>").addClass("barPhone").text(data[i].phone);
                blurbAddressCol.append(blurbAddress); blurbAddressCol.append(blurbCity); blurbAddressCol.append(blurbPhone);
                var restOfBlurb = $("<div></div>").addClass("col-xs-9").addClass("col-sm-9");
                    var barLink = $("<a></a>").text(data[i].name).attr("href", data[i].barPage).attr("target", "_blank");
                    barLink.append("&nbsp;&nbsp;&nbsp;");
                    var checkinButton = $("<button></button").addClass("checkInButton").attr("onclick", "checkIn('" + data[i].id + "', '" + data[i].attendeesNum + "')");
                        var checkinTotal = $("<span></span>").text(data[i].attendeesNum).addClass("attendees").attr("id", data[i].id);
                        var checkinStatic = $("<span></span>").text(" going");
                    checkinButton.append(checkinTotal); checkinButton.append(checkinStatic);
                    var barReview = $("<div></div>").addClass("reviewSnip").text(data[i].review1);
                restOfBlurb.append(barLink); restOfBlurb.append(checkinButton); 
                restOfBlurb.append(brTag); 
                restOfBlurb.append(barReview);
            blurbRow.append(blurbAddressCol); blurbRow.append(restOfBlurb); 
            blurbRow.append(brTag);
            barBlurb.append(blurbRow);
                $("#searchResults").append(barBlurb);
            }
            }});
            }
            });
            function checkIn(barID, attendees){
            console.log("triggered" + attendees);
            $.ajax({
                url: "/checkIn", method: "POST", data: {"barID": barID},
                success: function(data){
                    if(data.success){
                         var currentNum = parseInt(attendees);
                        if(!data.decrement){
                            currentNum++;
                        }
                        else{
                            currentNum--;
                        }
                        $("#" + barID).html(currentNum);
                        console.log("checkIn('" + barID + "', '" + currentNum + "')");
                        $("#" + barID).parent().attr("onclick", "checkIn('" + barID + "', '" + currentNum + "')");
                }
                if(data.redirect){
                    window.location = data.redirect;
                }
            }
        });
            }
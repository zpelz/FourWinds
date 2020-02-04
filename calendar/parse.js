//globals
var headers = new Array();
var descriptions = new Array();
var imgURLs = new Array();
var dates = new Array();
var times = new Array();
var starts = new Array();
var ends = new Array();
var locs = new Array();

var page;

//Month text to date object
var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
}


function strip_html(str){
    if((str ===null) || (str===''))
        return false;
    else 
        str = str.toString();

    str = str.replace(/(&ldquo;)*/g,'');
    str = str.replace(/(&rdquo;)*/g,'');
    str = str.replace(/(&nbsp;)*/g,'');
    str = str.replace(/(&amp;)*/g,'');
    str = str.replace(/<[^>]*>/g, '');
    return limitText(str);
}

$(document).ready(function(){
   
    var feed = "https://american.campuslabs.com/engage/events.rss"
    page = 0;
    $.ajax(feed,{
        accepts:{
            xml:"application/rss+xml"
        },

        dataType:"xml",
        success:function(data){
            $(data).find("item").each(function(){
                
                var el = $(this);
                var desc = el.find('description').text();
                
                var url = el.find('enclosure').attr('url'); //image
                
                //time shenanigans
                var dtStart = el.find('start').text(); //full start date
                var dtEnd = el.find('end').text(); //full end date NEEDED????
                var fullDate = dtStart.substring(17,25) + dtEnd.substring(17,25);
                
                var startTemp = el.find('start').text();
                var endTemp = el.find('end').text();
                
                var tempLoc = el.find('location').text();
                
                starts.push(timeConverter(startTemp));
                ends.push(timeConverter(endTemp));
                
                dates.push(dtStart.substring(0,11));
                headers.push(el.find('title').text());
                    //console.log(headers);   
                imgURLs.push(url);
                descriptions.push(strip_html(desc).trim());
                console.log('init desc ' + descriptions);
                locs.push(tempLoc);
            });
        }
       
    });
    
    
    setTimeout(function(){
        assign(page);
    }, 500);
    
    $('#up').click(function(e){
        console.log("page " + page)
        if(page*7 > headers.length-1){
            return;
        }else{
            page++;
            assign(page);
        }
    });
});




function timeConverter(val){
    var dTemp = val;	
    dTemp = new Date(dTemp);
    dTemp = dTemp.toString();
    dTemp = dTemp.substring(16,25);	
    dTemp = dTemp.split(':');						
    var hours = Number(dTemp[0]);
    var minutes = Number(dTemp[1]);
    var timeVal; 

    if(hours > 0 && hours <=12){
        timeVal = '' + hours;
    }else if(hours > 12){
        timeVal = '' +(hours-12);
    }else if(hours ==0){
        timeVal = "12";
    }
    timeVal += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeVal += (hours >=12) ? " P.M." : " A.M";
    return timeVal;
}

function limitText(str){ //run in the strip_html function
    if(str.length > 190){
        var outText = str.substring(0,187) + "...";
        return outText;				
    }else{
        return str;
    }
}

function monthTranslator(val){
    if(val > dates.length -1){
        return;
    }
    var d = dates[val].substring(8,11);	
    d = months[d] + "/" + dates[val].substring(5,7);
    d = d.replace(/(0)/gi,'');			

    return d;
}


function assign(val){
    var h=val*7;
    var desc=val*7;
    var date=val*7;
    var imgVal=val*7;
    
    $('.eventTitle').each(function(){
        if(h > headers.length-1){
            $(this).text('');
        }
        $(this).text(headers[h]);
        h++;
    })
    
    $('.description').each(function(){
        if(desc > desc.length-1){
            console.log("i should be clearing description");
            $(this).text('');
        }
        console.log('description length: ' + desc.length);
        $(this).text(descriptions[desc]);
        desc++;
    })
    
    $('.date').each(function(){
        if(date > dates.length-1){
            $(this).text('');
            $('.time').text('');
        }
        $(this).text(monthTranslator(date) + ' | ');
        
        $('.time').text(starts[date] + '-' + ends[date]);
        $('.location').text(locs[date]);
        
        date++;
    })
    

    
    $('.img').each(function(){
        if(imgVal > imgURLs.length-1){
            $(this).css('display','none');
        }
        $(this).attr('src',imgURLs[imgVal]);
        imgVal++;
    })
    
    monthTranslator(val);
}



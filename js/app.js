class App{

    menu_sel=0;

    onLoad(){
        ce.extension_id="ekfllnbpcoejhfbelcngmlkhjjihlblj";
        ce.setColor("#82b74b");
        app.show_main();
        ce.get_list_app_other();
        $("#footer-donation").html(ce.donation_html());
    }

    show_menu(){
        $("#app_menu").empty();
        var btn_match=$('<li class="nav-item"><a class="nav-link '+(app.menu_sel==0 ? "active" : "")+'" href="#"><i class="fas fa-futbol"></i> Matches</a></li>');
        $(btn_match).click(function(){
            app.show_main();
        });
        $("#app_menu").append(btn_match);

        var btn_scorer=$('<li class="nav-item"><a class="nav-link '+(app.menu_sel==1 ? "active" : "")+'" href="#"><i class="fas fa-running"></i> Scorer</a></li>');
        $(btn_scorer).click(function(){
            app.show_competitions();
        });
        $("#app_menu").append(btn_scorer);

        var btn_list=$('<li class="nav-item"><a class="nav-link '+(app.menu_sel==2 ? "active" : "")+'" href="#"><i class="fas fa-list"></i> Bookmark</a></li>');
        $(btn_list).click(function(){
            app.show_bookmarks();
        });
        $("#app_menu").append(btn_list);

        var btn_rate=$('<li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-star"></i> Rate</a></li>');
        $(btn_rate).click(function(){
            ce.rate();
        });
        $("#app_menu").append(btn_rate);
    }

    show_main(){
        this.menu_sel=0;
        $("#body_main").html('<div class="row"><div class="col-12 pt-3 mb-3 text-center"><i class="fas fa-spinner fa-spin"></i></div></div>');
        app.fetchData("matches","https://nodejs-server-fnc.vercel.app/api/api.js",(response)=>{
            var matches=response.matches;
            $('#body_main').empty();
            $.each(matches,function(index,m){
                $('#body_main').append(app.box_matche_item(m));
            });
            ce.top();
        },()=>{
            $('#body_main').html('<p>Error !</p>');
        });
        app.show_menu();
    }

    box_matche_item(data){
        var area=data.area;
        var homeTeam=data.homeTeam;
        var awayTeam=data.awayTeam;
        var html='';
        html+='<div role="button" class="card bg-light mb-3">';
        html+='<div class="card-header">';
            html+='<img src="'+area.flag+'" style="width:15px"/> '+area.name;
            if(data["index_offline"]!=null)
                html+='<button class="btn-del-bookmark btn btn-sm" style="float:right"><i class="fas fa-trash-alt"></i></button>';
            else
                html+='<button class="btn-add-bookmark btn btn-sm" style="float:right"><i class="fas fa-plus-square"></i></button>';
        html+='</div>';
        html+='<div class="card-body text-center fs-6">';
            html+='<div class="row card-text" style="font-size:12px">';
                html+='<div class="col-4">';
                html+='<img class="w-50" src="'+homeTeam.crest+'"/><br/>';
                html+=homeTeam.name;
                html+='</div>';

                html+='<div class="col-4">';
                html+=data.status+'<br/>';
                html+='<small>'+data.lastUpdated+'</small>';
                html+='</div>';

                html+='<div class="col-4">';
                html+='<img class="w-50" src="'+awayTeam.crest+'"/><br/>';
                html+=awayTeam.name;
                html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        var emp_matche=$(html);
        $(emp_matche).click(function(){
            app.show_info_matche(data);
        });

        if(data["index_offline"]!=null){
            $(emp_matche).find(".btn-del-bookmark").click(function(){
                var index_item=data["index_offline"];
                app.delete_item_bookmark(index_item,()=>{
                    ce.msg("Delete item success!","Delete","success");
                    app.show_bookmarks();
                });
                return false;
            });
        }else{
            $(emp_matche).find(".btn-add-bookmark").click(function(){
                app.add_bookmark(data,()=>{
                    ce.msg("Add Bookmark success!","Bookmark","success");
                });
                return false;
            });
        }
        return emp_matche;
    }

    show_info_matche(data){
        var homeTeam=data.homeTeam;
        var awayTeam=data.awayTeam;

        var html='';
        html+='<div class="row text-center">';
            html+='<div class="col-4">';
            html+='<img class="w-50" src="'+homeTeam.crest+'"/><br/>';
            html+=homeTeam.name+"<br/>";
            html+='<small class="text-muted">'+homeTeam.shortName+'</small>';
            html+='</div>';

            html+='<div class="col-4" style="font-size:10px">';
                html+='<i class="fas fa-stopwatch"></i><br/>';
                html+=data.status+" : "+data.lastUpdated+"</br>";
                html+='<i class="fas fa-map-marked"></i><br/>';
                html+=data.stage+"</br>";
                html+='<i class="fas fa-calendar-day"></i><br/>';
                html+=data.matchday+" Day";
            html+='</div>';

            html+='<div class="col-4">';
                html+='<img class="w-50" src="'+awayTeam.crest+'"/><br/>';
                html+=awayTeam.name+"<br/>";
            html+='<small class="text-muted">'+awayTeam.shortName+'</small>';
            html+='</div>';
        html+='</div>';
        

        html+='<ul class="list-group list-group-flush">';
        if(data.area!=null){
            var area=data.area;
            html+='<li class="list-group-item">';
                html+='<b>Area</b><br/>';
                html+='<img src="'+area.flag+'" style="width:13px;" class="rounded-sm"/> '+area.name+' <small class="text-success">'+area.code+'</small>';
            html+='</li>';
        }

        if(data.competition!=null){
            var competition=data.competition;
            html+='<li class="list-group-item">';
                html+='<b>Competition</b><br/>';
                html+='<img src="'+competition.emblem+'" style="width:13px;" class="rounded-sm"/> '+competition.name+' <small class="text-success">'+competition.code+'</small><br/>';
                html+='<small class="text-info">'+competition.type+'</small>';
            html+='</li>';
        }

        if(data.season!=null){
            var season=data.season;
            html+='<li class="list-group-item">';
                html+='<b>Season</b><br/>';
                html+='Start Date: <small class="text-info">'+season.startDate+'</small><br/>';
                html+='End Date: <small class="text-info">'+season.endDate+'</small><br/>';
                html+='Current Match Day: <small class="text-info">'+season.currentMatchday+'</small><br/>';
                if(season.winner!=null) html+='Winner : <small class="text-info">'+season.winner+'</small>';
            html+='</li>';
        }
        html+='</ul>';

        $('#body_main').html(html);
        ce.top();
    }

    show_competitions(){
        this.menu_sel=1;
        $("#body_main").html('<div class="row"><div class="col-12 pt-3 mb-3 text-center"><i class="fas fa-spinner fa-spin"></i></div></div>');
        app.fetchData("competitions","https://nodejs-server-fnc.vercel.app/api/goal_competitions.js",(response)=>{
            var competitions=response.competitions;
            $('#body_main').html('<ul class="list-group list-group-flush" id="list_competitions"></ul>');
            $.each(competitions,function(index,m){
                var area=m.area;
                var currentSeason=m.currentSeason;
                let html='';
                html+='<li role="button" class="list-group-item">';
                    html+='<i class="fas fa-cannabis"></i> '+m.name+'<br/>';
                    html+='<small class="text-muted">'+area.name+' <i class="text-info">'+area.code+'</i></small><br/>';
                    html+='<small class="text-muted float-end"><i class="far fa-calendar-alt"></i> '+currentSeason.startDate+' <i class="far fa-calendar-check"></i> '+currentSeason.endDate+'</small>';
                html+='</li>';
                var emp_c=$(html);
                $(emp_c).click(function(){
                    app.show_scorers(m.code);
                });
                $("#list_competitions").append(emp_c);
            });
            ce.top();
        },()=>{
            $('#body_main').html('<p>Error !</p>');
        });
        this.show_menu();
    }

    show_scorers(id){
        Swal.fire('Please wait');
        Swal.showLoading();
        app.fetchData("scorers_"+id,"https://nodejs-server-fnc.vercel.app/api/goal_scorers.js?id="+id,(response)=>{
            Swal.close();
            var scorers=response.scorers;
            $("#body_main").empty();
            if(scorers.length==0){
                $("#body_main").html(app.none());
            }else{
                $('#body_main').html('<ul class="list-group list-group-flush" id="list_competitions"></ul>');
                $.each(scorers,function(index,m){
                    var player=m.player;
                    var team=m.team;
                    var html='';
                    html+='<li role="button" class="list-group-item">';
                        html+='<i class="fas fa-user-ninja"></i> '+player.name+"<br/>";
                        html+='<small class="text-muted">'+team.name+'</small> <small class="text-success" style="float:right"><i class="far fa-futbol"></i> '+m.goals+'</small>';
                    html+='</li>';
                    var emp_c=$(html);
                    $(emp_c).click(function(){
                        app.show_player(m);
                    });
                    $("#list_competitions").append(emp_c);
                });
                ce.top();
            }
        },()=>{
            Swal.close();
            $('#body_main').html('<p>Error !</p>');
        });
    }

    show_player(data){
        var player=data.player;
        var html='';
        html+='<h5 class="text-center w-100">'+player.name+'</h5>';
        if(data.playedMatches!=null) html+='<span class="btn btn-sm  btn-light m-1">Played Matches : <b>'+data.playedMatches+'</b></span>';
        if(data.goals!=null) html+='<span class="btn btn-sm btn-light m-1">Goals : <b>'+data.goals+'</b></span>';
        if(data.assists!=null) html+='<span class="btn btn-sm btn-light m-1">Assists : <b>'+data.assists+'</b></span>';
        if(data.penalties!=null) html+='<span class="btn btn-sm btn-light m-1">Penalties : <b>'+data.penalties+'</b></span>';

        html+='<ul class="list-group list-group-flush">';
        if(data.player!=null){
            html+='<li class="list-group-item">';
                html+='<b>Info</b><br/>';
                if(player.firstName!=null) html+='<small>First Name</small> : <span class="text-info">'+player.firstName+'</span><br/>';
                if(player.lastName!=null) html+='<small>Last Name</small> : <span class="text-info">'+player.lastName+'</span><br/>';
                if(player.dateOfBirth!=null) html+='<small>Date Of Birth</small> : <span class="text-info">'+player.dateOfBirth+'</span><br/>';
                if(player.nationality!=null) html+='<small>Nationality</small> : <span class="text-info">'+player.nationality+'</span><br/>';
                if(player.section!=null) html+='<small>Section</small> : <span class="text-info">'+player.section+'</span><br/>';
                if(player.position!=null) html+='<small>Position</small> : <span class="text-info">'+player.position+'</span><br/>';
                if(player.shirtNumber!=null) html+='<small>Shirt Number</small> : <span class="text-info">'+player.shirtNumber+'</span>';
            html+='</li>';
        }

        if(data.team!=null){
            var team=data.team
            html+='<li class="list-group-item">';
                html+='<b>Team</b><br/>';
                if(team.crest) html+='<div class="w-100 text-center"><img style="width:30px" src="'+team.crest+'"></div>';
                if(team.name!=null) html+='<small>Name</small> : <span class="text-info">'+team.name+'</span><br/>';
                if(team.shortName!=null) html+='<small>Short Name</small> : <span class="text-info">'+team.shortName+'</span><br/>';
                if(team.tla!=null) html+='<small>TLA</small> : <span class="text-info">'+team.tla+'</span><br/>';
                if(team.address!=null) html+='<small>Address</small>:<a href="https://www.google.com/maps/search/'+team.address+'" class="text-info" target="_blank" rel="noopener noreferrer">'+team.address+'</a><br/>';
                if(team.website!=null) html+='<small>Website</small>:<a href="'+team.website+'" class="text-info" target="_blank" rel="noopener noreferrer">'+team.website+'</a><br/>';
                if(team.founded!=null) html+='<small>Founded</small> : <span class="text-info">'+team.founded+'</span><br/>';
                if(team.clubColors!=null) html+='<small>Club Colors</small> : <span class="text-info">'+team.clubColors+'</span><br/>';
                if(team.venue!=null) html+='<small>Venue</small> : <span class="text-info">'+team.venue+'</span><br/>';
            html+='</li>';
        }
        html+='</ul>';

        $('#body_main').html(html);
        ce.top();
    }

    fetchData(id_data,url, callback,act_fail=null) {
        var data = localStorage.getItem('cachedData'+id_data);
        var timestamp = localStorage.getItem('cachedDataTimestamp'+id_data);
    
        if (data && timestamp) {
            var currentTime = new Date().getTime();
            var elapsed = currentTime - timestamp;

            if (elapsed < 280000) {
                callback(JSON.parse(data));
                return;
            }
        }

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                localStorage.setItem('cachedData'+id_data, JSON.stringify(response));
                localStorage.setItem('cachedDataTimestamp'+id_data, new Date().getTime());
                callback(response);
            },
            error: function(xhr, status, error) {
                if(act_fail) act_fail();
            }
        });
    }

    show_bookmarks(){
        app.menu_sel=2;
        $("#body_main").html('<div class="row"><div class="col-12 pt-3 mb-3 text-center"><i class="fas fa-spinner fa-spin"></i></div></div>');

        chrome.storage.local.get({bookmarks: []}, function (result) {
            var list_bookmark = result.bookmarks;
            $("#body_main").empty();
            if(list_bookmark.length==0){
                $("#body_main").html(app.none());
            }
            
            $.each(list_bookmark,function(index,b){
                b["index_offline"]=index;
                $('#body_main').append(app.box_matche_item(b));
            });
        });

        app.show_menu();
        ce.top();
    }
    
    add_bookmark(data,act_done=null){
        chrome.storage.local.get({bookmarks: []}, function (result) {
            var list_bookmark = result.bookmarks;
            data["index_offline"]=list_bookmark.length;
            list_bookmark.push(data);
            chrome.storage.local.set({bookmarks: list_bookmark}, function () {
                if(act_done) act_done();
            });
        });
    }

    delete_item_bookmark(index,act_done=null){
        chrome.storage.local.get({bookmarks: []}, function (result) {
            var list_bookmark = result.bookmarks;
            list_bookmark.splice(index, 1);
            chrome.storage.local.set({bookmarks: list_bookmark}, function () {
                if(act_done) act_done();
            });
        });
    }

    none(){
        return '<div class="row"><div class="col-12 text-center mb-3 mt-3"><img src="images/none.gif"/><br/>List None</div></div>';
    }
}
var app=new App();

$(document).ready(function() {
    app.onLoad();
});
class App{

    menu_sel=0;

    onLoad(){
        app.show_main();
    }

    show_menu(){
        $("#app_menu").html('');
        
        var btn_match=$('<a class="btn '+(app.menu_sel==0 ? "btn-dark" : "btn-light")+' btn-sm m-1" href="#"><i class="fas fa-futbol"></i> Matches</a>');
        $(btn_match).click(function(){
            app.show_main();
        });
        $("#app_menu").append(btn_match);

        var btn_scorer=$('<a class="btn '+(app.menu_sel==1 ? "btn-dark" : "btn-light")+' btn-sm m-1" href="#"><i class="fas fa-running"></i> Goal scorer</a>');
        $(btn_scorer).click(function(){
            app.show_competitions();
        });
        $("#app_menu").append(btn_scorer);
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
        html+='<div class="card-header"><img src="'+area.flag+'" style="width:15px"/> '+area.name+'</div>';
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
                $("#list_competitions").append(emp_c);
            });
        },()=>{
            Swal.close();
            $('#body_main').html('<p>Error !</p>');
        });
    }

    fetchData(id_data,url, callback,act_fail=null) {
        var data = localStorage.getItem('cachedData'+id_data);
        var timestamp = localStorage.getItem('cachedDataTimestamp'+id_data);
    
        if (data && timestamp) {
            var currentTime = new Date().getTime();
            var elapsed = currentTime - timestamp;

            if (elapsed < 180000) {
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
    
}
var app=new App();

$(document).ready(function() {
    app.onLoad();
    ce.get_list_app_other();
});
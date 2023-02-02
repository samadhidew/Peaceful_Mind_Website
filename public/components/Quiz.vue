<template> 
    
<div>
  <iframe
    width="2000px"
    height="1080px"
    src="https://forms.office.com/Pages/ResponsePage.aspx?id=ZayGlNM5JU2XfHbZwxwARioBSJu0wMFDnmNILO7RqedUNUhCUllIVjBJSENIQTNJRjVBWk9IT0lLQy4u&embed=true"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    style="border: none; max-width: 100%; max-height: 100vh"
    allowfullscreen
    webkitallowfullscreen
    mozallowfullscreen
    msallowfullscreen
  >
  </iframe>
</div>

</template>
    
    <script>
    export default{
        name:"Quiz"
    };
    </script>
    <style scoped>
    body {
  background: linear-gradient(to bottom, #d18534, #df642291, #bc5d32);
  margin: 0%;
}
#grid {
  display: grid;
  width: auto;
  grid-template-columns: auto auto auto auto;
  margin-left: auto;
  margin-right: auto;
  height: auto;
}
.imgs {
  float: left;
  position: relative;
  margin-bottom: 40px;
  margin-top: -10px;
  padding-bottom: 30px;
  height: 10px;
}

img {
  width: 100%;
  height: 350px;
}


.dis2 {
  text-align: right;
  color: rgb(255, 166, 0);
  margin-left: -200px;
  padding-right: 200px;
  margin-top: -390px;
  font-size: 40px;
}

.box {
  float: right;

  padding-left: 620px;
}

.box p {
  font-weight: bold;
  color: rgb(0, 0, 0);
}
* {
  box-sizing: border-box;
  margin-top: 25px;
  padding: 10px;
}



/* Clearfix (clear floats) */
.row::after {
  content: "";
  clear: both;
  display: table;
}
.title{
  margin: 0%;
  width:100%;
  background-color:rgb(196, 175, 36);
  height:60px;
  font-size: 28px;
  padding: 5px;
  font-weight: 80%;
  text-align: center;
  color:#b35123;
 
}

app-footer,app-navbar{
  
  padding: 0px;
}
    </style>
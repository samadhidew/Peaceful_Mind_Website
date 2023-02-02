<template> 
    <ul>
    <div class="name">
        <h3>Peaceful mind</h3>
    </div>
    <li><router-link to ="/Home">Home</router-link></li>
    <li><router-link to ="/sftips">Stress Free Tips</router-link></li>
    <li><router-link to ="/Quiz">quiz</router-link></li>
    <li><router-link to ="/Chat">Login</router-link></li>
</ul>
</template>
    
    <script>
    export default{
        name:"navbar"
    };
    </script>
    <style scoped>
    body {
  margin: 0%;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  background-size: cover;
  overflow: hidden;
  top: 0%;
  left: 0%;
  position: relative;
  width: 100%;
  
background:  #af8f80;
}
.name {
  float: left;
  list-style-type: none;
  margin-left: 10px;
  padding: 0;
  margin-top: 20px;
  color: #1c1103;
}

li {
  float: right;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 21px 18px;
  text-decoration: none;
}
li a:hover {
  background-color: #ff8c00;
}

    </style>
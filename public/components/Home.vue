<template> 
<section>
  <div class="slide-con">
    <div class="slide">
      <img src="./assets/img/images.jpg" width="100%" height="650px" />
    </div>
  </div>
</section>
<!--descrption-->
<div class="imgs">
  <div class="dis">Join with us to enhance your lifestyle</div>
  <div class="img">
    <img src="./assets/img/imagess.jpg"   />
  </div>
  <div class="box">
    <p>
      Almost everyone experiences stress once in a while. Do you recognize the feeling that more is
     expected of you than you can achieve? Whether at work, at home or, for example, on social media. 
     Children and family can be a lot of stress, but there can also be persistent pressures at work or in your free time.<br/><br/>
     
   Maybe you are sick or you have a loved one who is sick. You may be struggling with a relationship that isn’t going well. 
    Or maybe financial problems are keeping you awake or living in an environment of war or violence.
    There are so many circumstances that can cause tension in our body. <br/><br/>

     Everyone goes through stressful periods.  If you can calm down afterwards, then there is not much to worry about. 
    But if you live too long under stress and get too little rest, your body will protest.Not everyone is equally sensitive to stress. 
    Especially if you want to do things right and pay little attention to the things that are already going well, 
     you are more likely to become stressed.<br/>
    </p>
  </div>

</div>
</template>

<script>
export default{
    name:"Home"
};
</script>
<style scoped>
body{
    
    margin: 0%;
  }
  
  .slide-con{
    height: 100px;
    filter: grayscale(50%);
    margin-left: auto;
    margin-right: auto;
    position: relative;
    margin: auto;
  }
  
  .imgs{
   margin-top: 675px;
   
  }
  
  .img>img{
    float:right;
    height: 550px ;
    width: 700px;
  }
  .dis{
    margin-top: -20px;
    margin-bottom: -20px;
    color: #ff8c00;
    font-size: 25px;
    
  }
  
  .dis2{
    float: left;
    color: #000000;
    margin-right: 675px;
    margin-left: 40px;
   
    margin-top:-470px;
    font-size: 40px;
  }
  .box{
    float: center;
    margin-left: -10px;
    margin-bottom: -10px;
    margin-top: 40px;
   background-color: antiquewhite;
   
   
  }
  
  .box p{
    margin: 5%;
    text-align: left;
    margin-bottom: 120px;
    font-weight: bold;
    color: rgb(0, 0, 0);
  }
</style>
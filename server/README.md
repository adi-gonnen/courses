
To start this project run:

### `docker compose up --build`

This will run the backend container.<br />
Database will be created on the first run with a course in it.<br />
Open [http://localhost:1337/docs](http://localhost:1337/docs) to view the API's in the browser.

<br/>
API for this task:
<ul>
<li>GET: http://localhost:1337/courses
All the courses</li>
<li>GET: http://localhost:1337/courses/<uuid>
specific course with exercises </li>
<li>PUT: http://localhost:1337/courses/<uuid>/exercises
Replace or Insert exercise in a course</li>
</ul>



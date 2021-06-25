import { http } from "./http";

import "./websocket/client/ClientRedirectors";
import "./websocket/admin/AdminRedirectors";

http.listen(3333, () => console.log("Server is running on port 3333"));

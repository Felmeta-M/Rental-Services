import 'package:rental/locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppConstants {
  static String baseUrl = "http://localhost:5001 /api/v1";

  static String staticUrl = "http://localhost:5001";

  static String token = getIt<SharedPreferences>().getString("token") ?? "null";
  // static String token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDViNDQyOGQzZmFjNzY4Y2RmMWNiOCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2MzEyNjY4NTB9.edHxTrukr9ptkbubKCBP025dmFPMpRdngNQq3FHoD4g";
}

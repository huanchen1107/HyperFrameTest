import cv2
import sys

def extract_frame(video_path, time_in_seconds, output_image_path):
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Could not open video {video_path}")
        sys.exit(1)

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_number = int(time_in_seconds * fps)
    
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
    
    ret, frame = cap.read()
    
    if ret:
        cv2.imwrite(output_image_path, frame)
        print(f"Successfully extracted frame at {time_in_seconds}s to {output_image_path}")
    else:
        print(f"Error: Could not extract frame at {time_in_seconds}s")
        
    cap.release()

if __name__ == "__main__":
    extract_frame("public/video.mp4", 130.5, "public/static_background.png")

float maxDistance;
void setup() {
noStroke();
smooth();
size(768,890);
fill(0);
maxDistance = dist(0, 0, width/2, height/2);
}
void draw() {
background(204);
for (int i = 0; i <= width; i += 20) {
for (int j = 0; j <= height; j += 20) {
float mouseDist = dist(mouseX, mouseY, i, j);
float diameter = (mouseDist / maxDistance) * 80.0;
ellipse(i, j, diameter, diameter);
}
}
}

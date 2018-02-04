/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef WIDGETMAPEDITOR_H
#define WIDGETMAPEDITOR_H

#include <QOpenGLWidget>
#include <QOpenGLFunctions>
#include <QVector3D>
#include <QTimer>
#include <QSpinBox>
#include "widgetmenubarmapeditor.h"
#include "paneltextures.h"
#include "controlmapeditor.h"

// -------------------------------------------------------
//
//  CLASS WidgetMapEditor
//
//  A widget where the 3D map editor is drawn.
//
// -------------------------------------------------------

class WidgetMapEditor : public QOpenGLWidget,
                        protected QOpenGLFunctions
{
    Q_OBJECT
public:
    explicit WidgetMapEditor(QWidget *parent = 0);
    ~WidgetMapEditor();
    void setMenuBar(WidgetMenuBarMapEditor* m);
    void setPanelTextures(PanelTextures* m);
    void setTreeMapNode(QStandardItem* item);
    Map* loadMap(int idMap, QVector3D *position, QVector3D *positionObject,
                 int cameraDistance, double cameraHorizontalAngle,
                 double cameraVerticalAngle);
    void deleteMap();
    void initializeSpinBoxesCoords(QSpinBox* x, QSpinBox* z);
    void resizeGL(int width, int height);
    void initializeGL();
    void paintGL();
    void needUpdateMap(int idMap, QVector3D *position,
                       QVector3D *positionObject, int cameraDistance,
                       double cameraHorizontalAngle,
                       double cameraVerticalAngle);
    void updateCameraDistance(float coef);
    void initializeMap();
    void save();
    void onKeyPress(int k, double speed);
    void setCursorX(int x);
    void setCursorY(int y);
    void setCursorYplus(int yPlus);
    void setCursorZ(int z);
    Map* getMap() const;
    void updateSpinBoxes();
    void addObject();
    void deleteObject();
    void removePreviewElements();
    void renderText(QPainter& p, double x, double y, const QString &text,
                    const QFont& font = QFont(),
                    const QColor& fontColor = QColor(),
                    const QColor& outlineColor = QColor());
    void showHideGrid();
    void showHideSquareInformations();
    void undo();
    void redo();

private:
    WidgetMenuBarMapEditor* m_menuBar;
    PanelTextures* m_panelTextures;
    ControlMapEditor m_control;
    bool m_needUpdateMap;
    bool isGLInitialized;
    int m_idMap;
    QSet<int> m_keysPressed;
    QTimer* m_timerFirstPressure;
    bool m_firstPressure;
    QSpinBox* m_spinBoxX;
    QSpinBox* m_spinBoxZ;
    QVector3D* m_position;
    QVector3D* m_positionObject;
    int m_cameraDistance;
    double m_cameraHorizontalAngle;
    double m_cameraVerticalAngle;
    ContextMenuList* m_contextMenu;
    long m_elapsedTime;

public slots:
    void update();
    void onFirstPressure();

protected slots:
    void focusOutEvent(QFocusEvent*);
    void wheelEvent(QWheelEvent* event);
    void mouseMoveEvent(QMouseEvent *event);
    void mousePressEvent(QMouseEvent* event);
    void mouseReleaseEvent(QMouseEvent* event);
    void mouseDoubleClickEvent(QMouseEvent*);
    void keyPressEvent(QKeyEvent* event);
    void keyReleaseEvent(QKeyEvent* event);

    void contextNew();
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();
    void contextHero();
};

#endif // WIDGETMAPEDITOR_H

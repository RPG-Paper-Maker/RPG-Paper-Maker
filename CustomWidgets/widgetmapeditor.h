/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

class WidgetMapEditor : public QOpenGLWidget, protected QOpenGLFunctions
{
    Q_OBJECT
public:
    explicit WidgetMapEditor(QWidget *parent = nullptr);
    ~WidgetMapEditor();
    void setMenuBar(WidgetMenuBarMapEditor *m);
    void setPanelTextures(PanelTextures *m);
    void setTreeMapNode(QStandardItem *item);
    Map * getMap() const;

    Map * loadMap(int idMap, QVector3D *position, QVector3D *positionObject,
        int cameraDistance, double cameraHorizontalAngle, double
        cameraVerticalAngle);
    void deleteMap();
    void initializeSpinBoxesCoords(QSpinBox *x, QSpinBox *z);
    void resizeGL(int width, int height);
    void initializeGL();
    void paintGL();
    void needUpdateMap(int idMap, QVector3D *position, QVector3D *positionObject,
        int cameraDistance, double cameraHorizontalAngle, double cameraVerticalAngle);
    void updateCameraDistance(float coef);
    void initializeMap();
    void save();
    void onKeyPress(int k, double speed);
    void setCursorX(int x);
    void setCursorY(int y);
    void setCursorYplus(int yPlus);
    void setCursorZ(int z);
    void updateSpinBoxes();
    void addObject();
    void deleteObject();
    void removePreviewElements();
    void renderText(QPainter &p, double x, double y, const QString &text,
        const QFont& font = QFont(), const QColor& fontColor = QColor(),
        const QColor& outlineColor = QColor());
    void showHideGrid();
    void showHideSquareInformations();
    void undo();
    void redo();

private:
    WidgetMenuBarMapEditor *m_menuBar;
    PanelTextures *m_panelTextures;
    ControlMapEditor m_control;
    bool m_needUpdateMap;
    bool isGLInitialized;
    int m_idMap;
    QSet<int> m_keysPressed;
    QTimer *m_timerFirstPressure;
    bool m_firstPressure;
    QSpinBox *m_spinBoxX;
    QSpinBox *m_spinBoxZ;
    QVector3D *m_position;
    QVector3D *m_positionObject;
    int m_cameraDistance;
    double m_cameraHorizontalAngle;
    double m_cameraVerticalAngle;
    ContextMenuList *m_contextMenu;
    long m_elapsedTime;
    QColor m_backgroundColor;

public slots:
    void update();
    void onFirstPressure();

protected slots:
    void focusOutEvent(QFocusEvent*);
    void wheelEvent(QWheelEvent *event);
    void mouseMoveEvent(QMouseEvent *event);
    void mousePressEvent(QMouseEvent *event);
    void mouseReleaseEvent(QMouseEvent *event);
    void mouseDoubleClickEvent(QMouseEvent *);
    void keyPressEvent(QKeyEvent *event);
    void keyReleaseEvent(QKeyEvent *event);

    void contextNew();
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();
    void contextHero();
};

#endif // WIDGETMAPEDITOR_H

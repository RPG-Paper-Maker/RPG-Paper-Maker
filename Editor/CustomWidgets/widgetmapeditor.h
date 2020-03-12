/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
#include "systemdetection.h"

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
    int cameraDistance() const;
    double cameraHorizontalAngle() const;
    double cameraVerticalAngle() const;

    void applyMap(SystemDetection *detection, QVector3D *position, QVector3D
        *positionObject, int cameraDistance, double cameraHorizontalAngle,
        double cameraVerticalAngle);
    Map * loadMap(int idMap, QVector3D *position, QVector3D *positionObject,
        int cameraDistance, double cameraHorizontalAngle, double
        cameraVerticalAngle);
    void deleteMap();
    void initializeSpinBoxesCoords(QSpinBox *x, QSpinBox *y, QSpinBox *yPlus,
        QSpinBox *z);
    void resizeGL(int width, int height);
    void initializeGL();
    void paintGL();
    void needUpdateMap(int idMap, QVector3D *position, QVector3D *positionObject,
        int cameraDistance, double cameraHorizontalAngle, double
        cameraVerticalAngle);
    void needUpdateMapDetection(SystemDetection *detection, QVector3D *position,
        QVector3D *positionObject, int cameraDistance, double
        cameraHorizontalAngle, double cameraVerticalAngle);
    void updateCameraDistance(float coef);
    void initializeMap();
    void save();
    void onKeyPress(int k, double speed);
    void setCursorX(int x);
    void setCursorY(int y, int yPlus);
    void setCursorZ(int z);
    void updateSpinBoxes();
    void addObject();
    void deleteObject();
    void removePreviewElements();
    void renderText(QPainter &p, double x, double y, const QString &text,
        const QFont& font = QFont(), const QColor& fontColor = QColor(),
        const QColor& outlineColor = QColor(), bool isBottom = true);
    void showHideGrid();
    void showHideSquareInformations();
    void undo();
    void redo();
    void heightUp();
    void heightPlusUp();
    void heightDown();
    void heightPlusDown();
    void updateCursor();

private:
    WidgetMenuBarMapEditor *m_menuBar;
    PanelTextures *m_panelTextures;
    ControlMapEditor m_control;
    bool m_needUpdateMap;
    bool isGLInitialized;
    int m_idMap;
    SystemDetection *m_detection;
    QSet<int> m_keysPressed;
    QTimer *m_timerFirstPressure;
    bool m_firstPressure;
    QSpinBox *m_spinBoxX;
    QSpinBox *m_spinBoxY;
    QSpinBox *m_spinBoxYPlus;
    QSpinBox *m_spinBoxZ;
    QVector3D *m_position;
    QVector3D *m_positionObject;
    int m_cameraDistance;
    double m_cameraHorizontalAngle;
    double m_cameraVerticalAngle;
    ContextMenuList *m_contextMenu;
    long m_elapsedTime;
    QColor m_backgroundColor;
    QCursor m_cursorTranslate;
    QCursor m_cursorRotate;
    QCursor m_cursorScale;
    QCursor m_cursorPencil;
    QCursor m_cursorRectangle;
    QCursor m_cursorPinPaint;
    QImage m_imageLayerOn;
    QImage m_imageHeight;
    QImage m_imageHeightPlus;

public slots:
    void update();
    void onFirstPressure();

protected slots:
    bool focusNextPrevChild(bool);
    void focusOutEvent(QFocusEvent*);
    void wheelEvent(QWheelEvent *event);
    void enterEvent(QEvent *);
    void leaveEvent(QEvent *);
    void mouseMoveEvent(QMouseEvent *event);
    void mousePressEvent(QMouseEvent *event);
    void mouseReleaseEvent(QMouseEvent *event);
    void mouseDoubleClickEvent(QMouseEvent *event);
    void keyPressEvent(QKeyEvent *event);
    void keyReleaseEvent(QKeyEvent *event);

    void contextNew();
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();
    void contextHero();
    void onTransformationPositionChanged(Position &newPosition, Position
        &previousPosition);

signals:
    void selectPositionTransformation(Position *pn, bool positive);
};

#endif // WIDGETMAPEDITOR_H

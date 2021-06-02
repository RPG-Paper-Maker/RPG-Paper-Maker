/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    void updateTagsSquares(float s, float ps);
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
    void zoom(int value);
    void updateCursor();

protected:
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
    QImage m_imageBackground;
    int m_autotileFrame;
    QTimer *m_timerAutotileFrame;

public slots:
    void update();
    void onFirstPressure();
    void onAutotileFrame();

protected slots:
    virtual bool focusNextPrevChild(bool);
    virtual void focusOutEvent(QFocusEvent*);
    virtual void wheelEvent(QWheelEvent *event);
    virtual void enterEvent(QEvent *);
    virtual void leaveEvent(QEvent *);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseReleaseEvent(QMouseEvent *event);
    virtual void mouseDoubleClickEvent(QMouseEvent *event);
    virtual void keyPressEvent(QKeyEvent *event);
    virtual void keyReleaseEvent(QKeyEvent *event);

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

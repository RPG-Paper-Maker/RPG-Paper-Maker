/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QScriptEngine>
#include "widgetmapeditor.h"
#include "systemtroop.h"
#include "battler.h"
#include "widgetsupertree.h"

#ifndef WIDGETPREVIEWTROOP_H
#define WIDGETPREVIEWTROOP_H


class WidgetPreviewTroop : public WidgetMapEditor
{
    Q_OBJECT
public:
    explicit WidgetPreviewTroop(QWidget *parent = nullptr);
    ~WidgetPreviewTroop();

    void clear();
    void initializeTree(WidgetSuperTree *tree);
    void initialize(SystemTroop *troop);
    void getVectorExpression(QVector3D &vec, QString expression, int i = 0);

    virtual void paintGL();
    virtual Map * loadMap(int idMap, QVector3D *position, QVector3D *positionObject,
        int cameraDistance, double cameraHorizontalAngle, double cameraVerticalAngle);

protected:
    SystemTroop *m_troop;
    QList<Battler *> m_battlers;
    QScriptEngine m_engine;

public slots:
    void onTreeUpdated();

protected slots:
    virtual void wheelEvent(QWheelEvent *event);
    virtual void enterEvent(QEvent *);
    virtual void leaveEvent(QEvent *);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseReleaseEvent(QMouseEvent *event);
    virtual void mouseDoubleClickEvent(QMouseEvent *event);
    virtual void keyPressEvent(QKeyEvent *event);
    virtual void keyReleaseEvent(QKeyEvent *event);
};

#endif // WIDGETPREVIEWTROOP_H

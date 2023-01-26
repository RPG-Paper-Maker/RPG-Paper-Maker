/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETGRAPHICS_H
#define WIDGETGRAPHICS_H

#include <QPainter>
#include "systemstate.h"
#include "systempicture.h"
#include "widgetpreviewobject3d.h"

// -------------------------------------------------------
//
//  CLASS WidgetGraphics
//
//  A widget graphics of an object.
//
// -------------------------------------------------------

class WidgetGraphics : public WidgetPreviewObject3D
{
    Q_OBJECT
public:
    explicit WidgetGraphics(QWidget *parent = nullptr);
    ~WidgetGraphics();
    void setState(SystemState *s);
    bool isValueID() const;
    int id() const;
    int indexX() const;
    int indexY() const;
    QRect currentRect() const;

    void initializeParametersProperties(PrimitiveValue *valueID, QStandardItemModel
        *properties, QStandardItemModel *parameters);
    SystemPicture* getPicture(bool check = false);
    PictureKind getPictureKind(bool check = false);
    void updateCurrentObject();

protected:
    SystemState* m_state;
    bool m_selected;
    int m_borderOffset;
    PrimitiveValue *m_valueID;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    bool m_isValueID;
    int m_id;
    int m_indexX;
    int m_indexY;
    QRect m_currentRect;

    virtual void mousePressEvent(QMouseEvent*);
    virtual void mouseDoubleClickEvent(QMouseEvent*);
    virtual void paintEvent(QPaintEvent*);
    virtual void paintGL();
};

#endif // WIDGETGRAPHICS_H

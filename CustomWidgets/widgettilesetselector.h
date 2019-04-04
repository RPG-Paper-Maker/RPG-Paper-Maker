/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETTILESETSELECTOR_H
#define WIDGETTILESETSELECTOR_H

#include <QWidget>
#include <QPainter>
#include <widgetselectionrectangle.h>

// -------------------------------------------------------
//
//  CLASS WidgetTilesetSelector
//
//  A widget representing tileset selector.
//
// -------------------------------------------------------

class WidgetTilesetSelector : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetTilesetSelector(QWidget *parent = 0);
    ~WidgetTilesetSelector();
    void currentTexture(QRect &rect) const;
    void setImage(QString path);
    void setImageNone();

protected:
    QImage m_textureTileset;
    WidgetSelectionRectangle* m_selectionRectangle;

    void updateImage();
    void setRealCursorPosition();
    void makeFirstSelection(int x, int y, float zoom = 1.0f);
    void makeSelection(int x, int y, float zoom = 1.0f);
    void selectNone();

    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETTILESETSELECTOR_H

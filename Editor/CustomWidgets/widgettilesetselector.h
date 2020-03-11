/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    explicit WidgetTilesetSelector(QWidget *parent = nullptr);
    ~WidgetTilesetSelector();
    void setIsResizable(bool b);
    void setCurrentTexture(QRect& rect);
    void currentTexture(QRect &rect) const;
    void setImage(QString path);
    void setImageNone();

protected:
    bool m_isResizable;
    QImage m_textureTileset;
    WidgetSelectionRectangle* m_selectionRectangle;

    void updateImage();
    void setRealCursorPosition();
    void makeFirstSelection(int x, int y, float zoom = 1.0f);
    void makeSelection(int x, int y, float zoom = 1.0f);
    void selectNone();
    void translate();

    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETTILESETSELECTOR_H

/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETANIMATIONTEXTURE_H
#define WIDGETANIMATIONTEXTURE_H

#include <QWidget>

// -------------------------------------------------------
//
//  CLASS WidgetAnimationTexture
//
//  Widget used for texture animations.
//
// -------------------------------------------------------

class WidgetAnimationTexture : public QWidget
{
    Q_OBJECT
public:
    static const int MAX_SIZE;

    WidgetAnimationTexture(QWidget *parent = nullptr);
    int rows() const;
    void setRows(int r);
    int columns() const;
    void setColumns(int c);
    int currentRow() const;
    int currentColumn() const;
    const QImage & baseImage() const;
    const QImage & image() const;

    void updatePicture(int id);

protected:
    QImage m_baseImage;
    QImage m_image;
    int m_idPicture;
    int m_rows;
    int m_columns;
    int m_currentRow;
    int m_currentColumn;

    virtual void mousePressEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETANIMATIONTEXTURE_H

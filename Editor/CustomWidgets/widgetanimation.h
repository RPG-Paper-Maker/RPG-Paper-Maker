/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETANIMATION_H
#define WIDGETANIMATION_H

#include <QWidget>
#include <QScrollArea>

// -------------------------------------------------------
//
//  CLASS WidgetAnimation
//
//  Widget used for creating animations.
//
// -------------------------------------------------------

class WidgetAnimation : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetAnimation(QWidget *parent = nullptr);
    void setScrollArea(QScrollArea *scrollArea);

protected:
    QScrollArea *m_scrollArea;
    QImage m_imageBattler;
    int m_idBattler;
    QString m_textCoords;

    void updateBattlePicture(int id);

    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mouseLeaveEvent(QMouseEvent *);
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETANIMATION_H

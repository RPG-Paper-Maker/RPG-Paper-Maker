/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETBUTTONIMAGE_H
#define WIDGETBUTTONIMAGE_H

#include <QWidget>

// -------------------------------------------------------
//
//  CLASS WidgetButtonImage
//
//  Widget used for a button with image design (used for Patreon).
//
// -------------------------------------------------------

class WidgetButtonImage : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetButtonImage(QWidget *parent = nullptr);

    void updateImage(QString path, double zoom = 1.0);

protected:
    QImage m_image;

    virtual void enterEvent(QEvent *);
    virtual void leaveEvent(QEvent *);
    virtual void mousePressEvent(QMouseEvent *);
    virtual void paintEvent(QPaintEvent *);

signals:
    void clicked();

public slots:
};

#endif // WIDGETBUTTONIMAGE_H

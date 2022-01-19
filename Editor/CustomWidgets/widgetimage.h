/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETIMAGE_H
#define WIDGETIMAGE_H

#include <QWidget>

class WidgetImage : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetImage(QWidget *parent = nullptr);

    void updatePath(QString path);
    void updateImage(QImage& image);

protected:
    QImage m_image;

    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETIMAGE_H

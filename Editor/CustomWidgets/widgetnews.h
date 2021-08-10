/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETNEWS_H
#define WIDGETNEWS_H

#include <QWidget>

namespace Ui {
class WidgetNews;
}

class WidgetNews : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetNews(QWidget *parent = nullptr);
    ~WidgetNews();

    void update(QString title, QImage &image, QString link);

private:
    Ui::WidgetNews *ui;
    QString m_link;

protected:
    virtual void enterEvent(QEvent *);
    virtual void leaveEvent(QEvent *);
    virtual void mousePressEvent(QMouseEvent *);
};

#endif // WIDGETNEWS_H

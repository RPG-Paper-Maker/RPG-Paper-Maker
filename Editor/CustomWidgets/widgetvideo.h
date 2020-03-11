/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETVIDEO_H
#define WIDGETVIDEO_H

#include <QWidget>
#include <QListWidget>
#include "primitivevalue.h"
#include "systemcustomshape.h"

// -------------------------------------------------------
//
//  CLASS WidgetVideo
//
//  Widget used for choosing a video existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetVideo;
}

class WidgetVideo : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetVideo(QWidget *parent = nullptr);
    ~WidgetVideo();

    void initialize(SuperListItem *videoID);
    void update();
    void openDialog();

private:
    Ui::WidgetVideo *ui;
    CustomShapeKind m_kind;
    SuperListItem *m_videoID;

    void translate();

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();

signals:
    void shapeChanged();
};

#endif // WIDGETVIDEO_H

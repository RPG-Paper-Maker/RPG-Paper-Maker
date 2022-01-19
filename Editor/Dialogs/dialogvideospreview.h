/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGVIDEOSPREVIEW_H
#define DIALOGVIDEOSPREVIEW_H

#include <QDialog>
#include "systemvideo.h"

// -------------------------------------------------------
//
//  CLASS DialogVideosPreview
//
//  A dialog used for selecting a video in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogVideosPreview;
}

class DialogVideosPreview : public QDialog
{
    Q_OBJECT

public:
    explicit DialogVideosPreview(SuperListItem *videoID, QWidget *parent =
        nullptr);
    ~DialogVideosPreview();

protected:
    virtual void closeEvent(QCloseEvent *);
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogVideosPreview *ui;
    SuperListItem *m_videoID;
    int m_initialVideoID;

    void translate();

private slots:
    void on_accepted();
    void on_rejected();
};

#endif // DIALOGVIDEOSPREVIEW_H

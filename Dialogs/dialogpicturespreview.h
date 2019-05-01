/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGPICTURESPREVIEW_H
#define DIALOGPICTURESPREVIEW_H

#include <QDialog>
#include <QCloseEvent>
#include "picturekind.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS DialogPicturesPreview
//
//  A dialog used for selecting a picture in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogPicturesPreview;
}

class DialogPicturesPreview : public QDialog
{
    Q_OBJECT

public:
    explicit DialogPicturesPreview(SystemPicture* picture, PictureKind kind,
                                   QWidget *parent = 0);
    ~DialogPicturesPreview();
    SystemPicture* picture() const;
    int indexX() const;
    void setIndexX(int i);
    int indexY() const;
    void setIndexY(int i);
    void setCurrentTexture(QRect rect);
    void currentTexture(QRect &rect) const;

protected:
    virtual void closeEvent(QCloseEvent *);

private:
    Ui::DialogPicturesPreview *ui;
    PictureKind m_kind;
    int m_initialPictureID;

private slots:
    void on_accepted();
    void on_rejected();

signals:
    void dialogIsClosing();
};

#endif // DIALOGPICTURESPREVIEW_H

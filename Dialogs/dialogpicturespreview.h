/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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

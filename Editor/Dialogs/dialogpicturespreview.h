/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGPICTURESPREVIEW_H
#define DIALOGPICTURESPREVIEW_H

#include <QDialog>
#include <QCloseEvent>
#include "picturekind.h"
#include "systempicture.h"
#include "primitivevalue.h"

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
        PrimitiveValue *valueID = nullptr, QStandardItemModel *properties = nullptr,
        QStandardItemModel* parameters = nullptr, int indexX = 0, int indexY = 0,
        bool isLimitIndex = true, QWidget *parent = nullptr);
    ~DialogPicturesPreview();
    SystemPicture * picture() const;
    PrimitiveValue * idValue() const;
    bool isIDValue() const;
    int indexX() const;
    void setIndexX(int i);
    int indexY() const;
    void setIndexY(int i);
    void setCurrentTexture(QRect rect);
    void currentTexture(QRect &rect) const;

    void setAreNegIDsEnabled(bool b);

protected:
    virtual void closeEvent(QCloseEvent *);
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogPicturesPreview *ui;
    PictureKind m_kind;
    int m_initialPictureID;
    PrimitiveValue *m_idValue;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void translate();

public slots:
    void on_accepted();
    void on_rejected();
    void on_checkBoxPictureID_toggled(bool checked);

signals:
    void dialogIsClosing();
};

#endif // DIALOGPICTURESPREVIEW_H

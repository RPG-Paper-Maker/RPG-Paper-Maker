/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSHAPESPREVIEW_H
#define DIALOGSHAPESPREVIEW_H

#include <QDialog>
#include "systemcustomshape.h"

// -------------------------------------------------------
//
//  CLASS DialogShapesPreview
//
//  A dialog used for selecting a shape in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogShapesPreview;
}

class DialogShapesPreview : public QDialog
{
    Q_OBJECT

public:
    explicit DialogShapesPreview(SuperListItem *shapeID, CustomShapeKind kind,
        QWidget *parent = nullptr);
    ~DialogShapesPreview();

protected:
    virtual void closeEvent(QCloseEvent *);
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogShapesPreview *ui;
    CustomShapeKind m_kind;
    SuperListItem *m_shapeID;
    int m_initialShapeID;

    void translate();

private slots:
    void on_accepted();
    void on_rejected();
};

#endif // DIALOGSHAPESPREVIEW_H

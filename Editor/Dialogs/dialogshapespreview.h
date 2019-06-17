/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private:
    Ui::DialogShapesPreview *ui;
    CustomShapeKind m_kind;
    SuperListItem *m_shapeID;
    int m_initialShapeID;

private slots:
    void on_accepted();
    void on_rejected();
};

#endif // DIALOGSHAPESPREVIEW_H

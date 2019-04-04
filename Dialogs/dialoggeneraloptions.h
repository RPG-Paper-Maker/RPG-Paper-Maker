/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGGENERALOPTIONS_H
#define DIALOGGENERALOPTIONS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogGeneralOptions
//
//  A dialog used for setting general options.
//
// -------------------------------------------------------

namespace Ui {
class DialogGeneralOptions;
}

class DialogGeneralOptions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogGeneralOptions(QWidget *parent = nullptr);
    ~DialogGeneralOptions();

private:
    Ui::DialogGeneralOptions *ui;

    void initialize();

public slots:
    virtual void accept();
    virtual void reject();
    void on_comboBoxThemeCurrentIndexChanged(int index);
};

#endif // DIALOGGENERALOPTIONS_H

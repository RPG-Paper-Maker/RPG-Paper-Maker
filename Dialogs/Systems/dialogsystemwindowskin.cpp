#include "dialogsystemwindowskin.h"
#include "ui_dialogsystemwindowskin.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemWindowSkin::DialogSystemWindowSkin(SystemWindowSkin& windowSkin,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemWindowSkin),
    m_windowSkin(windowSkin)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemWindowSkin::~DialogSystemWindowSkin()
{
    delete ui;
}


// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemWindowSkin::initialize() {

}
